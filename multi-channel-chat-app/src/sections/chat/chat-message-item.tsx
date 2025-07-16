import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import { Iconify } from "@/components/iconify";

import { getMessage } from "./utils/get-message";
import { useAuthContext } from "@/auth/hooks/use-auth-context";
import { fToNow } from "@/utils/format-time";
import { Message } from "@/models/message/message";
import {
  Participant,
  ParticipantType,
} from "@/models/participants/participant";

// ----------------------------------------------------------------------

export function ChatMessageItem({
  message,
  participants,
  onOpenLightbox,
}: {
  message: Message;
  participants: Participant[];
  onOpenLightbox: () => void;
}) {
  const { user } = useAuthContext();

  const { me, senderDetails, hasImage } = getMessage({
    message,
    participants,
    currentUserId: `${user?.id}`,
  });

  const { firstName } = senderDetails;

  const { content, date_created, sender_type } = message;

  const renderInfo = (
    <Typography
      noWrap
      variant="caption"
      sx={{ mb: 1, color: "text.disabled", ...(!me && { mr: "auto" }) }}
    >
      {!me && `${firstName}, `}

      {fToNow(date_created)}
    </Typography>
  );

  const renderBody = (
    <Stack
      sx={{
        p: 1.5,
        minWidth: 48,
        maxWidth: 320,
        borderRadius: 1,
        typography: "body2",
        bgcolor: "background.neutral",
        ...(me && { color: "grey.800", bgcolor: "primary.lighter" }),
        ...(hasImage && { p: 0, bgcolor: "transparent" }),
      }}
    >
      {hasImage ? (
        <Box
          component="img"
          alt="attachment"
          src={content}
          onClick={() => onOpenLightbox()}
          sx={{
            width: 400,
            height: "auto",
            borderRadius: 1.5,
            cursor: "pointer",
            objectFit: "cover",
            aspectRatio: "16/11",
            "&:hover": { opacity: 0.9 },
          }}
        />
      ) : (
        <>
          {content}
          {sender_type === ParticipantType.CHATBOT && (
            <Typography
              variant="caption"
              color="primary"
              sx={{ display: "block", mt: 0.5 }}
            >
              Response by AI
            </Typography>
          )}
        </>
      )}
    </Stack>
  );

  const renderActions = (
    <Stack
      direction="row"
      className="message-actions"
      sx={{
        pt: 0.5,
        left: 0,
        opacity: 0,
        top: "100%",
        position: "absolute",
        transition: (theme) =>
          theme.transitions.create(["opacity"], {
            duration: theme.transitions.duration.shorter,
          }),
        ...(me && { right: 0, left: "unset" }),
      }}
    >
      <IconButton size="small">
        <Iconify icon="solar:reply-bold" width={16} />
      </IconButton>

      <IconButton size="small">
        <Iconify icon="eva:smiling-face-fill" width={16} />
      </IconButton>

      <IconButton size="small">
        <Iconify icon="solar:trash-bin-trash-bold" width={16} />
      </IconButton>
    </Stack>
  );

  if (!message.content) {
    return null;
  }

  return (
    <Stack
      direction="row"
      justifyContent={me ? "flex-end" : "unset"}
      sx={{ mb: 5 }}
    >
      {!me && <Avatar alt={firstName} sx={{ width: 32, height: 32, mr: 2 }} />}

      <Stack alignItems={me ? "flex-end" : "flex-start"}>
        {renderInfo}

        <Stack
          direction="row"
          alignItems="center"
          sx={{
            position: "relative",
            "&:hover": { "& .message-actions": { opacity: 1 } },
          }}
        >
          {renderBody}
          {renderActions}
        </Stack>
      </Stack>
    </Stack>
  );
}
