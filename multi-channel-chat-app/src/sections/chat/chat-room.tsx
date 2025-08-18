/* eslint-disable @typescript-eslint/no-explicit-any */
import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";

import { Scrollbar } from "@/components/scrollbar";

import { ChatRoomGroup } from "./chat-room-group";
import { ChatRoomSkeleton } from "./chat-skeleton";
import { ChatRoomSingle } from "./chat-room-single";
import { ChatRoomAttachments } from "./chat-room-attachments";
import { Participant } from "@/models/participants/participant";
import { Message } from "@/models/message/message";

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const NAV_DRAWER_WIDTH = 320;

export function ChatRoom({
  collapseNav,
  participants,
  messages,
  loading,
  omni_channel_name
}: {
  collapseNav: any;
  participants: Participant[];
  messages: Message[];
  loading: boolean;
  omni_channel_name: string;
}) {
  
  const { collapseDesktop, openMobile, onCloseMobile } = collapseNav;

  const isGroup = participants.length > 1;

  const attachments = messages.map((msg: Message) => msg.attachments).flat(1) || [];
  
  const renderContent = loading ? (
    <ChatRoomSkeleton />
  ) : (
    <Scrollbar>
      <div>
        {isGroup ? (
          <ChatRoomGroup participants={participants} />
        ) : (
          <ChatRoomSingle omni_channel_name={omni_channel_name} participant={participants[0]} />
        )}

        <ChatRoomAttachments attachments={attachments} />
      </div>
    </Scrollbar>
  );

  return (
    <>
      <Stack
        sx={{
          minHeight: 0,
          flex: "1 1 auto",
          width: NAV_WIDTH,
          display: { xs: "none", lg: "flex" },
          borderLeft: (theme: any) => `solid 1px ${theme.vars.palette.divider}`,
          transition: (theme: any) =>
            theme.transitions.create(["width"], {
              duration: theme.transitions.duration.shorter,
            }),
          ...(collapseDesktop && { width: 0 }),
        }}
      >
        {!collapseDesktop && renderContent}
      </Stack>

      <Drawer
        anchor="right"
        open={openMobile}
        onClose={onCloseMobile}
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: NAV_DRAWER_WIDTH } }}
      >
        {renderContent}
      </Drawer>
    </>
  );
}
