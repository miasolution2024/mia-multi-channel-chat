/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";

import { useResponsive } from "@/hooks/use-responsive";

import { getNavItem } from "./utils/get-nav-item";
import { useAuthContext } from "@/auth/hooks/use-auth-context";
import { useRouter } from "next/navigation";
import { fToNow } from "@/utils/format-time";
import { paths } from "@/routes/path";

// ----------------------------------------------------------------------

export function ChatNavItem({
  selected,
  collapse,
  conversation,
  onCloseMobile,
}: any) {
  const { user } = useAuthContext();

  const mdUp = useResponsive("up", "md");

  const router = useRouter();

  const { displayName, displayText, participants, lastActivity } = getNavItem({
    conversation,
    currentUserId: `${user?.id}`,
  });

  const singleParticipant = participants[0];

  const { participant_name } = singleParticipant;

  const handleClickConversation = useCallback(async () => {
    try {
      if (!mdUp) {
        onCloseMobile();
      }
      // await clickConversation(conversation.id);
      router.push(`${paths.dashboard.chat}?id=${conversation.id}`);
    } catch (error) {
      console.error(error);
    }
  }, [conversation.id, mdUp, onCloseMobile, router]);

  const renderSingle = (
    <Badge
      key={status}
      variant='standard'
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Avatar alt={participant_name} sx={{ width: 48, height: 48 }} />
    </Badge>
  );

  return (
    <Box component="li" sx={{ display: "flex" }}>
      <ListItemButton
        onClick={handleClickConversation}
        sx={{
          py: 1.5,
          px: 2.5,
          gap: 2,
          ...(selected && { bgcolor: "action.selected" }),
        }}
      >
        <Badge
          color="error"
          overlap="circular"
          badgeContent={collapse ? conversation.unreadCount : 0}
        >
          {renderSingle }
        </Badge>

        {!collapse && (
          <>
            <ListItemText
              primary={displayName}
              primaryTypographyProps={{
                noWrap: true,
                component: "span",
                variant: "subtitle2",
              }}
              secondary={displayText}
              secondaryTypographyProps={{
                noWrap: true,
                component: "span",
                variant: conversation.unreadCount ? "subtitle2" : "body2",
                color: conversation.unreadCount
                  ? "text.primary"
                  : "text.secondary",
              }}
            />

            <Stack alignItems="flex-end" sx={{ alignSelf: "stretch" }}>
              <Typography
                noWrap
                variant="body2"
                component="span"
                sx={{ mb: 1.5, fontSize: 12, color: "text.disabled" }}
              >
                {fToNow(lastActivity)}
              </Typography>

              {!!conversation.unreadCount && (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    bgcolor: "info.main",
                    borderRadius: "50%",
                  }}
                />
              )}
            </Stack>
          </>
        )}
      </ListItemButton>
    </Box>
  );
}
