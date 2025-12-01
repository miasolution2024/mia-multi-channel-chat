/* eslint-disable @typescript-eslint/no-explicit-any */

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import { Scrollbar } from "@/components/scrollbar";

import { ConversationChannel } from "@/models/conversation/conversations";
import { Avatar, Badge, ListItemButton } from "@mui/material";
import { CONFIG } from "@/config-global";
import { useGetUnreadCountGroupByChannel } from "@/actions/conversation";
import { useGetGroupsByUserId } from "@/actions/user";
import { useAuthContext } from "@/auth/hooks/use-auth-context";
import { paths } from "@/routes/path";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// ----------------------------------------------------------------------

const NAV_COLLAPSE_WIDTH = 80;

export const CHANNELS = [
  {
    name: ConversationChannel.FACEBOOK,
    src: `${CONFIG.assetsDir}/assets/images/logo/facebook.png`,
  },
  {
    name: ConversationChannel.ZALO,
    src: `${CONFIG.assetsDir}/assets/images/logo/zalo.webp`,
    enableAddFeature: true,
  },
  {
    name: ConversationChannel.ZALO_OA,
    src: `${CONFIG.assetsDir}/assets/images/logo/zalo-oa.png`,
    enableAddFeature: false,
    link: `${CONFIG.serverUrl}/directus-extension-social-connector/api/zalo/auth`
    // link: `http://localhost:8055/directus-extension-social-connector/api/zalo/auth`
  },
  {
    name: ConversationChannel.WHATSAPP,
    src: `${CONFIG.assetsDir}/assets/images/logo/whatsapp.png`,
  },
  // {
  //   name: ConversationChannel.INSTAGRAM,
  //   src: `${CONFIG.assetsDir}/assets/images/logo/instagram.png`,
  // },
  // {
  //   name: ConversationChannel.WEBSITE,
  //   src: `${CONFIG.assetsDir}/assets/images/logo/logo.png`,
  // },
];

export function ChatChannels() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentChannel = (searchParams.get("channel") ||
    ConversationChannel.FACEBOOK) as ConversationChannel;

  const [selectedChannel, setSelectedChannel] =
    useState<ConversationChannel>(currentChannel);

  const handleSelectedChannel = (channel: ConversationChannel) => {
    setSelectedChannel(channel);
    const newSearchParams = new URLSearchParams();
    for (const key of searchParams.keys()) {
      if (key !== "channel") {
        newSearchParams.append(key, searchParams.get(key) || "");
      }
    }
    newSearchParams.set("channel", channel);
    const newQueryString = newSearchParams.toString();

    router.push(`${paths.dashboard.chat}?${newQueryString}`);
  };

  const { user } = useAuthContext();
  const { userGroups } = useGetGroupsByUserId(user?.id);

  const participantIds = [
    ...(userGroups?.map((g) => g.id.toString()) || []),
    user?.id || "",
  ].filter((id) => !!id);

  const { conversationUnRead } =
    useGetUnreadCountGroupByChannel(participantIds);

  const renderList = (
    <nav>
      <Box component="ul">
        {CHANNELS.map(
          (c: { name: ConversationChannel; src: string }, index: number) => {
            const unreadCount = parseInt(
              conversationUnRead?.find((item) => item.channel === c.name)?.count
                .unread_count || "0"
            );

            return (
              <Box key={index} component="li" sx={{ display: "flex" }}>
                <ListItemButton
                  onClick={() => handleSelectedChannel(c.name)}
                  sx={{
                    py: 1.5,
                    px: 2.5,
                    gap: 2,
                    ...(c.name === selectedChannel && {
                      bgcolor: "action.selected",
                    }),
                  }}
                >
                  <Badge
                    badgeContent={unreadCount}
                    color="error"
                    overlap="circular"
                  >
                    <Avatar
                      alt={c.name}
                      src={c.src}
                      sx={{ width: 40, height: 40 }}
                    />
                  </Badge>
                </ListItemButton>
              </Box>
            );
          }
        )}
      </Box>
    </nav>
  );

  const renderContent = <Scrollbar sx={{ pb: 1 }}>{renderList}</Scrollbar>;

  return (
    <>
      <Stack
        sx={{
          minHeight: 0,
          flex: "1 1 auto",
          width: NAV_COLLAPSE_WIDTH,
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
    </>
  );
}
