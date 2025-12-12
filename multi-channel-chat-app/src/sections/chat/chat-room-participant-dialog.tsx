/* eslint-disable @typescript-eslint/no-explicit-any */
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import DialogContent from "@mui/material/DialogContent";

import { Iconify } from "@/components/iconify";
import { Participant } from "@/models/participants/participant";

// ----------------------------------------------------------------------

export function ChatRoomParticipantDialog({
  participant,
  open,
  onClose,
}: {
  participant: Participant;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", right: 8, top: 8 }}
      >
        <Iconify icon="mingcute:close-line" />
      </IconButton>

      <DialogContent sx={{ py: 5, px: 3, display: "flex" }}>
        <Avatar
          alt={participant.participant_name}
          src={participant.participant_avatar}
          sx={{ width: 96, height: 96, mr: 3 }}
        />

        <Stack spacing={1}>
          <Typography variant="subtitle1">
            {participant.participant_name}
          </Typography>
          {participant.participant_phone && (
            <Stack
              direction="row"
              sx={{ typography: "caption", color: "text.disabled" }}
            >
              <Iconify
                icon="solar:phone-bold"
                width={16}
                sx={{ flexShrink: 0, mr: 0.5, mt: "2px" }}
              />
              {participant.participant_phone}
            </Stack>
          )}

            {participant.participant_email && (
            <Stack
              direction="row"
              sx={{ typography: "caption", color: "text.disabled" }}
            >
              <Iconify
                icon="fluent:mail-24-filled"
                width={16}
                sx={{ flexShrink: 0, mr: 0.5, mt: "2px" }}
              />
              {participant.participant_email}
            </Stack>
          )}

          {/* <Stack spacing={1} direction="row" sx={{ pt: 1.5 }}>
            <IconButton
              size="small"
              color="error"
              sx={{
                borderRadius: 1,
                bgcolor: (theme: any) =>
                  varAlpha(theme.vars.palette.error.mainChannel, 0.08),
                "&:hover": {
                  bgcolor: (theme: any) =>
                    varAlpha(theme.vars.palette.error.mainChannel, 0.16),
                },
              }}
            >
              <Iconify width={18} icon="solar:phone-bold" />
            </IconButton>

            <IconButton
              size="small"
              color="info"
              sx={{
                borderRadius: 1,
                bgcolor: (theme: any) =>
                  varAlpha(theme.vars.palette.info.mainChannel, 0.08),
                "&:hover": {
                  bgcolor: (theme: any) =>
                    varAlpha(theme.vars.palette.info.mainChannel, 0.16),
                },
              }}
            >
              <Iconify width={18} icon="solar:chat-round-dots-bold" />
            </IconButton>

            <IconButton
              size="small"
              color="primary"
              sx={{
                borderRadius: 1,
                bgcolor: (theme: any) =>
                  varAlpha(theme.vars.palette.primary.mainChannel, 0.08),
                "&:hover": {
                  bgcolor: (theme: any) =>
                    varAlpha(theme.vars.palette.primary.mainChannel, 0.16),
                },
              }}
            >
              <Iconify width={18} icon="fluent:mail-24-filled" />
            </IconButton>

            <IconButton
              size="small"
              color="secondary"
              sx={{
                borderRadius: 1,
                bgcolor: (theme: any) =>
                  varAlpha(theme.vars.palette.secondary.mainChannel, 0.08),
                "&:hover": {
                  bgcolor: (theme: any) =>
                    varAlpha(theme.vars.palette.secondary.mainChannel, 0.16),
                },
              }}
            >
              <Iconify width={18} icon="solar:videocamera-record-bold" />
            </IconButton>
          </Stack> */}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
