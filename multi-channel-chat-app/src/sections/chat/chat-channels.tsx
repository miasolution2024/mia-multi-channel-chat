/* eslint-disable @typescript-eslint/no-explicit-any */

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import { Scrollbar } from "@/components/scrollbar";

import { ConversationChannel } from "@/models/conversation/conversations";
import { Avatar, Badge, ListItemButton } from "@mui/material";
import { CONFIG } from "@/config-global";

// ----------------------------------------------------------------------

const NAV_COLLAPSE_WIDTH = 80;

const CHANNELS = [
  {
    name: ConversationChannel.WEBSITE,
    src: `${CONFIG.assetsDir}/assets/images/logo/logo.png`,
  },
  {
    name: ConversationChannel.FACEBOOK,
    src: `${CONFIG.assetsDir}/assets/images/logo/facebook.png`,
  },
  {
    name: ConversationChannel.ZALO,
    src: `${CONFIG.assetsDir}/assets/images/logo/zalo.png`,
  },
  {
    name: ConversationChannel.WHATSAPP,
    src: `${CONFIG.assetsDir}/assets/images/logo/whatsapp.png`,
  },
];

export function ChatChannels({
  selectedChannel,
  handleSelectChannel,
}: {
  selectedChannel: ConversationChannel;
  handleSelectChannel: (channel: ConversationChannel) => void;
}) {
  const renderList = (
    <nav>
      <Box component="ul">
        {CHANNELS.map(
          (c: { name: ConversationChannel; src: string }, index: number) => (
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
                  key={index}
                  variant="standard"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                >
                  <Avatar
                    alt={c.name}
                    src={c.src}
                    sx={{ width: 40, height: 40 }}
                  />
                </Badge>
              </ListItemButton>
            </Box>
          )
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
