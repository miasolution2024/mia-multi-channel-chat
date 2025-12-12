/* eslint-disable @typescript-eslint/no-explicit-any */
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

import { getMessage } from "./utils/get-message";
import { useAuthContext } from "@/auth/hooks/use-auth-context";
import { fDateTime, fToNow } from "@/utils/format-time";
import { Message, MessageType } from "@/models/message/message";
import {
  Participant,
  ParticipantType,
} from "@/models/participants/participant";
import { CONFIG } from "@/config-global";
import { FileThumbnail } from "@/components/file-thumbnail";
import { ListItemText, Paper } from "@mui/material";
import { fData } from "@/utils/format-number";

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

  const { me, senderDetails, type } = getMessage({
    message,
    participants,
    currentUserId: `${user?.id}`,
  });

  const { firstName, participant_avatar } = senderDetails;

  const { content, attachments, date_created, sender_type } = message;

  const firstAttachment = attachments[0]?.directus_files_id;
  
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

  const renderAttachment = firstAttachment && (
    <Paper
      variant="outlined"
      sx={{
        gap: 2,
        borderRadius: 2,
        display: "flex",
        cursor: "pointer",
        position: "relative",
        bgcolor: "transparent",
        p: { xs: 2.5, sm: 2 },
        alignItems: { xs: "unset", sm: "center" },
        flexDirection: { xs: "column", sm: "row" },
        "&:hover": {
          bgcolor: "background.paper",
          boxShadow: (theme: any) => theme.customShadows.z20,
        },
      }}
    >
      <FileThumbnail file={firstAttachment?.filename_download} />

      <ListItemText
        primary={firstAttachment.filename_download}
        secondary={
          <>
            {fData(firstAttachment.filesize)}
            <Box
              sx={{
                mx: 0.75,
                width: 2,
                height: 2,
                borderRadius: "50%",
                bgcolor: "currentColor",
              }}
            />
            {fDateTime(firstAttachment.created_on)}
          </>
        }
        primaryTypographyProps={{ noWrap: true, typography: "subtitle2" }}
        secondaryTypographyProps={{
          mt: 0.5,
          component: "span",
          alignItems: "center",
          typography: "caption",
          color: "text.disabled",
          display: "inline-flex",
        }}
      />
    </Paper>
  );

  const renderImage = firstAttachment && (
    <Box
      component="img"
      alt="attachment"
      src={`${CONFIG.serverUrl}/assets/${firstAttachment.id}`}
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
        overflow: "auto",
        ...(me && { color: "grey.800", bgcolor: "primary.lighter" }),
        ...(type !== MessageType.TEXT && { p: 0, bgcolor: "transparent" }),
      }}
    >
      {type === MessageType.IMAGE && renderImage}
      {type === MessageType.TEXT && (
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
      {type !== MessageType.TEXT &&
        type !== MessageType.IMAGE &&
        renderAttachment}
    </Stack>
  );

  // const renderActions = (
  //   <Stack
  //     direction="row"
  //     className="message-actions"
  //     sx={{
  //       pt: 0.5,
  //       left: 0,
  //       opacity: 0,
  //       top: "100%",
  //       position: "absolute",
  //       transition: (theme) =>
  //         theme.transitions.create(["opacity"], {
  //           duration: theme.transitions.duration.shorter,
  //         }),
  //       ...(me && { right: 0, left: "unset" }),
  //     }}
  //   >
  //     <IconButton size="small">
  //       <Iconify icon="solar:reply-bold" width={16} />
  //     </IconButton>

  //     <IconButton size="small">
  //       <Iconify icon="eva:smiling-face-fill" width={16} />
  //     </IconButton>

  //     <IconButton size="small">
  //       <Iconify icon="solar:trash-bin-trash-bold" width={16} />
  //     </IconButton>
  //   </Stack>
  // );

  if (!message.content && type === MessageType.TEXT) {
    return null;
  }

  return (
    <Stack
      direction="row"
      justifyContent={me ? "flex-end" : "unset"}
      sx={{ mb: 5 }}
    >
      {!me && (
        <Avatar
          alt={firstName}
          src={participant_avatar}
          sx={{ width: 32, height: 32, mr: 2 }}
        />
      )}

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
          {/* {renderActions} */}
        </Stack>
      </Stack>
    </Stack>
  );
}
