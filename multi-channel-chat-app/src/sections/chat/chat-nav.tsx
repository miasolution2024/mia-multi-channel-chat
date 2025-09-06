/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState, useEffect, useCallback, useRef } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import ClickAwayListener from "@mui/material/ClickAwayListener";

import { useResponsive } from "@/hooks/use-responsive";

import { Iconify } from "@/components/iconify";
import { Scrollbar } from "@/components/scrollbar";

import { ToggleButton } from "./styles";
import { ChatNavItem } from "./chat-nav-item";
import { ChatPageFilter } from "./chat-nav-page-filter";
import { ChatNavSearchResults } from "./chat-nav-search-results";
import { useAuthContext } from "@/auth/hooks/use-auth-context";
import { paths } from "@/routes/path";
import { useRouter, useSearchParams } from "next/navigation";
import useSWRInfinite from "swr/infinite";
import {
  Conversation,
  ConversationChannel,
} from "@/models/conversation/conversations";
import {
  getConversationByParticipantId,
  getConversationsUnreadCountURL,
  getConversationsURL,
} from "@/actions/conversation";
import { websocketMessage } from "@/models/websocket-message";
import { mutate } from "swr";
import { CONFIG } from "@/config-global";
import NotificationSound from "@/components/notification-sound/notification-sound";
import { uuidv4 } from "@/utils/uuidv4";
import { fetcher } from "@/utils/axios";
import { useGetOmniChannelsByChannel } from "@/actions/omni-channel";
import { useGetCustomersByOmniChannel } from "@/actions/customer";
import { Customer } from "@/models/customer/customer";
import { useDebounce } from "@/hooks/use-debounce";
import { SelectChangeEvent } from "@mui/material";
import { useGetGroupsByUserId } from "@/actions/user";
import { ChatChannels } from "./chat-channels";

// ----------------------------------------------------------------------

const NAV_WIDTH = 320;

export function ChatNav({
  collapseNav,
  selectedConversationId,
}: {
  collapseNav: any;
  selectedConversationId: number;
}) {
  const router = useRouter();

  const mdUp = useResponsive("up", "md");

  const { user } = useAuthContext();

  const {
    openMobile,
    onOpenMobile,
    onCloseMobile,
    onCloseDesktop,
    collapseDesktop,
  } = collapseNav;

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedPageId, setSelectedPageId] = useState("");

  const searchParams = useSearchParams();

  const selectedChannel = (searchParams.get("channel") ||
    ConversationChannel.FACEBOOK) as ConversationChannel;

  const debouncedQuery = useDebounce(searchQuery);

  const { userGroups } = useGetGroupsByUserId(user?.id);

  const participantIds = [
    ...(userGroups?.map((g) => g.id.toString()) || []),
    user?.id || "",
  ].filter((id) => !!id);

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (
      (previousPageData && previousPageData?.data?.length === 0) ||
      !selectedPageId ||
      !user?.id
    )
      return null;
    const url = getConversationsURL(
      selectedChannel,
      selectedPageId,
      participantIds
    );

    return `${url}&page=${pageIndex + 1}`;
  };

  const { data, setSize } = useSWRInfinite<{
    data: Conversation[];
  }>(getKey, fetcher);

  const conversations = useMemo(
    () => (data ? data.flatMap((page) => page.data) : []),
    [data]
  );

  const allIds = conversations.map((c) => c.id);

  const { omniChannels } = useGetOmniChannelsByChannel(
    selectedChannel,
    user?.id
  );

  const { customers } = useGetCustomersByOmniChannel(
    selectedPageId,
    debouncedQuery
  );

  useEffect(() => {
    if (omniChannels.length > 0) {
      setSelectedPageId(omniChannels[0].page_id);
    }
  }, [omniChannels]);

  useEffect(() => {
    setSize(1);
  }, [selectedPageId, setSize]);

  const websocketRef = useRef<WebSocket | null>(null);
  const chatNavRef = useRef<any>(null);

  const [playNotification, setPlayNotification] = useState<boolean>(false);

  useEffect(() => {
    if (playNotification) {
      const timer = setTimeout(() => {
        setPlayNotification(false);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [playNotification]);

  useEffect(() => {
    if (!user?.accessToken || !user?.id) {
      if (websocketRef.current) {
        console.log("Closing existing connection due to missing dependencies.");
        websocketRef.current.close();
        websocketRef.current = null;
      }
      return;
    }

    // Close any existing connection before opening a new one
    if (websocketRef.current) {
      console.log(`Closing old connection for conversations subscription`);
      websocketRef.current.close();
      websocketRef.current = null; // Clear the ref
    }

    const connection = new WebSocket(CONFIG.websocketUrl);

    const sendAuth = () => {
      connection.send(
        JSON.stringify({
          type: "auth",
          access_token: user?.accessToken,
        })
      );
    };

    const sendSubscribeConversations = () => {
      connection.send(
        JSON.stringify({
          type: "subscribe",
          action: "read",
          collection: "mc_conversations",
          uid: uuidv4(),
          query: {
            fields: ["id,participants.participant_id"],
            filter: {
              participants: {
                participant_id: {
                  _eq: user?.id,
                },
              },
            },
          },
        })
      );
    };

    const handleOpen = () => {
      websocketRef.current = connection;

      console.log(`WebSocket connection opened for conversations subscription`);
      sendAuth();
    };

    const handleMessage = (message: MessageEvent) => {
      const data = JSON.parse(message.data) as websocketMessage;

      if (data.type == "auth" && data.status == "ok") {
        sendSubscribeConversations();
      }

      if (data.event === "create") {
        console.log(`New conversation created`);
        setPlayNotification(true);
        mutate(getConversationsURL(selectedChannel, selectedPageId, participantIds));
        mutate(getConversationsUnreadCountURL(participantIds));
      } else if (data.event === "update") {
        console.log(`Conversation updated updated!`);
        mutate(getConversationsURL(selectedChannel, selectedPageId, participantIds));
        mutate(getConversationsUnreadCountURL(participantIds));
      }

      if (data.type === "ping") {
        connection.send(JSON.stringify({ type: "pong" }));
      }
    };

    const handleClose = () => {
      console.log(`WebSocket connection closed for conversations subscription`);
      websocketRef.current = null;
    };

    const handleError = (error: Event) => {
      console.error({
        event: "onerror",
        error,
        message: `WebSocket error for conversations subscription`,
      });
      websocketRef.current = null;
    };

    connection.addEventListener("open", handleOpen);
    connection.addEventListener("message", handleMessage);
    connection.addEventListener("close", handleClose);
    connection.addEventListener("error", handleError);

    return () => {
      if (websocketRef.current) {
        console.log(
          `Cleaning up: Closing WebSocket connection for conversations subscription`
        );
        websocketRef.current.close();
        websocketRef.current = null;
      }
    };
  }, [user?.accessToken, user?.id]);

  useEffect(() => {
    if (!mdUp) {
      onCloseDesktop();
    }
  }, [onCloseDesktop, mdUp]);

  const handleSearchContacts = useCallback(
    (inputValue: string) => {
      setSearchQuery(inputValue);
    },
    [customers]
  );

  const handleClickAwaySearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const handleClickResult = useCallback(
    async (result: Customer) => {
      handleClickAwaySearch();

      const linkTo = (id: number) =>
        router.push(`${paths.dashboard.chat}?id=${id}`);

      try {
        const conversationSearchResults = (await getConversationByParticipantId(
          result.id
        )) as Conversation[];

        if (conversationSearchResults.length > 0) {
          linkTo(conversationSearchResults[0].id);
          return;
        }
      } catch (error) {
        console.error("Error handling click result:", error);
      }
    },
    [handleClickAwaySearch, router, conversations]
  );

  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setSize((prev) => prev + 1);
          }
        },
        { threshold: 1.0 }
      );

      observer.observe(node);

      return () => observer.disconnect();
    },
    [setSize]
  );

  const handSelectPage = (event: SelectChangeEvent) => {
    setSelectedPageId(event.target.value);
    if (chatNavRef.current) {
      chatNavRef.current.scrollTop = 0;
    }
  };

  const renderList = (
    <nav>
      <Box component="ul">
        {conversations.map((c: Conversation) => (
          <ChatNavItem
            key={c.id}
            collapse={collapseDesktop}
            conversation={c}
            selected={c.id === selectedConversationId}
            onCloseMobile={onCloseMobile}
          />
        ))}

        <div ref={loadMoreRef}></div>
      </Box>
    </nav>
  );

  const renderListResults = (
    <ChatNavSearchResults
      query={searchQuery}
      results={customers}
      onClickResult={handleClickResult}
    />
  );

  const renderSearchInput = (
    <ClickAwayListener onClickAway={handleClickAwaySearch}>
      <TextField
        fullWidth
        value={searchQuery}
        onChange={(event) => handleSearchContacts(event.target.value)}
        placeholder="Search contacts..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: "text.disabled" }} />
            </InputAdornment>
          ),
        }}
        sx={{ mt: 2.5 }}
      />
    </ClickAwayListener>
  );

  const renderContent = (
    <Stack height="100%" direction="row">
      <ChatChannels />

      <Stack sx={{ width: NAV_WIDTH }}>
        <Box sx={{ p: 2.5 }}>
          <ChatPageFilter
            pages={omniChannels}
            handleChange={handSelectPage}
            pageId={selectedPageId}
          />
          {renderSearchInput}
        </Box>

        <Scrollbar ref={chatNavRef} sx={{ pb: 1 }}>
          {searchQuery && !!allIds.length ? renderListResults : renderList}
        </Scrollbar>
      </Stack>
    </Stack>
  );

  return (
    <>
      <ToggleButton onClick={onOpenMobile} sx={{ display: { md: "none" } }}>
        <Iconify width={16} icon="solar:users-group-rounded-bold" />
      </ToggleButton>

      <Stack
        sx={{
          minHeight: 0,
          flex: "1 1 auto",
          display: { xs: "none", md: "flex" },
          borderRight: (theme: any) =>
            `solid 1px ${theme.vars.palette.divider}`,
          transition: (theme) =>
            theme.transitions.create(["width"], {
              duration: theme.transitions.duration.shorter,
            }),
        }}
      >
        {renderContent}
      </Stack>

      <Drawer
        open={openMobile}
        onClose={onCloseMobile}
        slotProps={{ backdrop: { invisible: true } }}
      >
        {renderContent}
      </Drawer>
      <NotificationSound play={playNotification} />
    </>
  );
}
