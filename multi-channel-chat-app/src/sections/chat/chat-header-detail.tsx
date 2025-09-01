/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";

import Stack from "@mui/material/Stack";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";

import { useResponsive } from "@/hooks/use-responsive";

import { Iconify } from "@/components/iconify";
import { usePopover, CustomPopover } from "@/components/custom-popover";

import { ChatHeaderSkeleton } from "./chat-skeleton";
import { fToNow } from "@/utils/format-time";
import {
  Participant,
  ParticipantType,
} from "@/models/participants/participant";
import { FormControlLabel, Switch } from "@mui/material";
import {
  updateCustomerChatbotActiveAsync,
  useGetCustomerById,
} from "@/actions/customer";

// ----------------------------------------------------------------------

export function ChatHeaderDetail({
  collapseNav,
  participants,
  loading,
}: {
  collapseNav: any;
  participants: Participant[];
  loading: boolean;
}) {
  const popover = usePopover();

  const lgUp = useResponsive("up", "lg");

  const singleParticipant = participants.find(
    (p) => p.participant_type == ParticipantType.CUSTOMER
  );

  const { collapseDesktop, onCollapseDesktop, onOpenMobile } = collapseNav;

  const { customer } = useGetCustomerById(singleParticipant?.participant_id);

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!customer) return;
    setChecked(customer?.chatbot_response);
  }, [customer]);

  const handleToggleNav = useCallback(() => {
    if (lgUp) {
      onCollapseDesktop();
    } else {
      onOpenMobile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lgUp]);

  const handActiveChatbot = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!customer) return;

    setChecked(event.target.checked);

    await updateCustomerChatbotActiveAsync(customer.id, event.target.checked);
  };

  const renderSingle = (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Badge
        variant="dot"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Avatar
          src={singleParticipant?.participant_avatar}
          alt={singleParticipant?.participant_name}
        />
      </Badge>

      <ListItemText
        primary={singleParticipant?.participant_name}
        secondary={
          singleParticipant?.status === "offline"
            ? // ? fToNow(singleParticipant?.lastActivity)
              fToNow(new Date())
            : singleParticipant?.status
        }
        secondaryTypographyProps={{
          component: "span",
          ...(singleParticipant?.status !== "offline" && {
            textTransform: "capitalize",
          }),
        }}
      />
    </Stack>
  );

  if (loading) {
    return <ChatHeaderSkeleton />;
  }

  return (
    <>
      {renderSingle}

      <Stack direction="row" flexGrow={1} justifyContent="flex-end">
        <FormControlLabel
          control={
            <Switch
              name="switch"
              checked={checked}
              onChange={handActiveChatbot}
            />
          }
          label="Chatbot Active"
        />

        {/* <IconButton>
          <Iconify icon="solar:phone-bold" />
        </IconButton>

        <IconButton>
          <Iconify icon="solar:videocamera-record-bold" />
        </IconButton> */}

        <IconButton onClick={handleToggleNav}>
          <Iconify
            icon={
              !collapseDesktop
                ? "ri:sidebar-unfold-fill"
                : "ri:sidebar-fold-fill"
            }
          />
        </IconButton>

        <IconButton onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </Stack>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:bell-off-bold" />
            Hide notifications
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:forbidden-circle-bold" />
            Block
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:danger-triangle-bold" />
            Report
          </MenuItem>

          <Divider sx={{ borderStyle: "dashed" }} />

          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
            sx={{ color: "error.main" }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
