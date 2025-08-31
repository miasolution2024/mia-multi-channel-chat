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

// ----------------------------------------------------------------------

const NAV_COLLAPSE_WIDTH = 80;

const CHANNELS = [
  {
    name: ConversationChannel.FACEBOOK,
    src: `${CONFIG.assetsDir}/assets/images/logo/facebook.png`,
  },
  {
    name: ConversationChannel.ZALO,
    src: `${CONFIG.assetsDir}/assets/images/logo/zalo.webp`,
  },
  {
    name: ConversationChannel.ZALO_OA,
    src: `${CONFIG.assetsDir}/assets/images/logo/zalo-oa.png`,
  },
  {
    name: ConversationChannel.WHATSAPP,
    src: `${CONFIG.assetsDir}/assets/images/logo/whatsapp.png`,
  },
  {
    name: ConversationChannel.INSTAGRAM,
    src: `${CONFIG.assetsDir}/assets/images/logo/instagram.png`,
  },
  {
    name: ConversationChannel.WEBSITE,
    src: `${CONFIG.assetsDir}/assets/images/logo/logo.png`,
  },
];

export function ChatChannels({
  selectedChannel,
  handleSelectChannel,
}: {
  selectedChannel: ConversationChannel;
  handleSelectChannel: (channel: ConversationChannel) => void;
}) {
  const { user } = useAuthContext();
  const { userGroups } = useGetGroupsByUserId(user?.id);

  const participantIds = [
    ...(userGroups?.map((g) => g.id.toString()) || []),
    user?.id || "",
  ].filter((id) => !!id);

  const { conversationUnRead } = useGetUnreadCountGroupByChannel(participantIds);

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
                  onClick={() => handleSelectChannel(c.name)}
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
    </>
  );
}
