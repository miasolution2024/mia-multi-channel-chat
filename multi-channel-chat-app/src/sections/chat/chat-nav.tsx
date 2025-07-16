/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState, useEffect, useCallback, useRef } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import ClickAwayListener from "@mui/material/ClickAwayListener";

import { useResponsive } from "@/hooks/use-responsive";

import { Iconify } from "@/components/iconify";
import { Scrollbar } from "@/components/scrollbar";

import { ToggleButton } from "./styles";
import { ChatNavItem } from "./chat-nav-item";
import { ChatNavAccount } from "./chat-nav-account";
import { ChatNavItemSkeleton } from "./chat-skeleton";
import { ChatNavSearchResults } from "./chat-nav-search-results";
import { useAuthContext } from "@/auth/hooks/use-auth-context";
import { today } from "@/utils/format-time";
import { paths } from "@/routes/path";
import { useRouter } from "next/navigation";
import { Participant } from "@/models/participants/participant";
import { Conversation } from "@/models/conversation/conversations";
import { initialConversation } from "./utils/initial-conversation";
import {
  createConversationAsync,
  getConversationsURL,
} from "@/actions/conversation";
import { websocketMessage } from "@/models/websocket-message";
import { mutate } from "swr";
import { CONFIG } from "@/config-global";

// ----------------------------------------------------------------------

const NAV_WIDTH = 320;

const NAV_COLLAPSE_WIDTH = 96;

export function ChatNav({
  loading,
  contacts,
  collapseNav,
  conversations,
  selectedConversationId,
}: {
  loading: boolean;
  contacts: Participant[];
  collapseNav: any;
  conversations: Conversation[];
  selectedConversationId: string;
}) {
  const router = useRouter();

  const mdUp = useResponsive("up", "md");

  const { user } = useAuthContext();
  const allIds = conversations.map((c) => c.id);

  const {
    openMobile,
    onOpenMobile,
    onCloseMobile,
    onCloseDesktop,
    collapseDesktop,
    onCollapseDesktop,
  } = collapseNav;

  const [searchContacts, setSearchContacts] = useState<{
    query: string;
    results: Participant[];
  }>({
    query: "",
    results: [],
  });

  const myContact = useMemo(
    () => ({
      id: `${user?.id}`,
      role: user?.role,
      email: `${user?.email}`,
      full_name: `${user?.full_name}`,
      lastActivity: today(),
      avatar: `${user?.avatar}`,
      status: "online",
    }),
    [user]
  );

  const websocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!user?.accessToken) {
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
          query: {
            fields: ["id,participants.participant_id"],
            filter: {
              participants: {
                participant_id: {
                  _eq: "$CURRENT_USER",
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
      sendSubscribeConversations();
    };

    const handleMessage = (message: MessageEvent) => {
      const data = JSON.parse(message.data) as websocketMessage;

      if (data.event === "create" || data.event === "update") {
        console.log(`[${data.event}] New conversation created or updated!`);
        mutate(getConversationsURL());
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
  }, [user?.accessToken]);

  useEffect(() => {
    if (!mdUp) {
      onCloseDesktop();
    }
  }, [onCloseDesktop, mdUp]);

  const handleToggleNav = useCallback(() => {
    if (mdUp) {
      onCollapseDesktop();
    } else {
      onCloseMobile();
    }
  }, [mdUp, onCloseMobile, onCollapseDesktop]);

  const handleClickCompose = useCallback(() => {
    if (!mdUp) {
      onCloseMobile();
    }
    router.push(paths.dashboard.chat);
  }, [mdUp, onCloseMobile, router]);

  const handleSearchContacts = useCallback(
    (inputValue: any) => {
      setSearchContacts((prevState) => ({ ...prevState, query: inputValue }));

      if (inputValue) {
        const results = contacts.filter((contact: Participant) =>
          contact.participant_name.toLowerCase().includes(inputValue)
        );

        setSearchContacts((prevState) => ({ ...prevState, results }));
      }
    },
    [contacts]
  );

  const handleClickAwaySearch = useCallback(() => {
    setSearchContacts({ query: "", results: [] });
  }, []);

  const handleClickResult = useCallback(
    async (result: Participant) => {
      handleClickAwaySearch();

      const linkTo = (id: string) =>
        router.push(`${paths.dashboard.chat}?id=${id}`);

      try {
        const conversation = conversations.find((c) =>
          c.participants.some((p) => p.participant_id == result.participant_id)
        );
        // Check if the conversation already exists
        if (!!conversation?.id) {
          linkTo(conversation.id);
          return;
        }

        // Find the recipient in contacts
        const recipient = contacts.find(
          (contact: any) => contact.id === result.id
        );
        if (!recipient) {
          console.error("Recipient not found");
          return;
        }

        // Prepare conversation data
        const { conversationData } = initialConversation({
          recipients: [recipient],
          me: myContact,
        });

        // Create a new conversation
        const res = await createConversationAsync(conversationData);
        linkTo(res.data.id);
      } catch (error) {
        console.error("Error handling click result:", error);
      }
    },
    [contacts, handleClickAwaySearch, myContact, router, conversations]
  );

  const renderLoading = <ChatNavItemSkeleton />;

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
      </Box>
    </nav>
  );

  const renderListResults = (
    <ChatNavSearchResults
      query={searchContacts.query}
      results={searchContacts.results}
      onClickResult={handleClickResult}
    />
  );

  const renderSearchInput = (
    <ClickAwayListener onClickAway={handleClickAwaySearch}>
      <TextField
        fullWidth
        value={searchContacts.query}
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
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{ p: 2.5, pb: 0 }}
      >
        {!collapseDesktop && (
          <>
            <ChatNavAccount />
            <Box sx={{ flexGrow: 1 }} />
          </>
        )}

        <IconButton onClick={handleToggleNav}>
          <Iconify
            icon={
              collapseDesktop
                ? "eva:arrow-ios-forward-fill"
                : "eva:arrow-ios-back-fill"
            }
          />
        </IconButton>

        {!collapseDesktop && (
          <IconButton onClick={handleClickCompose}>
            <Iconify width={24} icon="solar:user-plus-bold" />
          </IconButton>
        )}
      </Stack>

      <Box sx={{ p: 2.5, pt: 0 }}>{!collapseDesktop && renderSearchInput}</Box>

      {loading ? (
        renderLoading
      ) : (
        <Scrollbar sx={{ pb: 1 }}>
          {searchContacts.query && !!allIds.length
            ? renderListResults
            : renderList}
        </Scrollbar>
      )}
    </>
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
          width: NAV_WIDTH,
          display: { xs: "none", md: "flex" },
          borderRight: (theme: any) =>
            `solid 1px ${theme.vars.palette.divider}`,
          transition: (theme) =>
            theme.transitions.create(["width"], {
              duration: theme.transitions.duration.shorter,
            }),
          ...(collapseDesktop && { width: NAV_COLLAPSE_WIDTH }),
        }}
      >
        {renderContent}
      </Stack>

      <Drawer
        open={openMobile}
        onClose={onCloseMobile}
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: NAV_WIDTH } }}
      >
        {renderContent}
      </Drawer>
    </>
  );
}
