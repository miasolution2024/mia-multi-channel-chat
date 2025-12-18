import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Popover from "@mui/material/Popover";

import { Iconify } from "@/components/iconify";
import { usePopover } from "@/components/custom-popover";
import type { Content } from "./view/content-assistant-list-view";

interface ContentViewActionMenuProps {
  content: Content;
  onView: (content: Content) => void;
}

export function ContentViewActionMenu({
  content,
  onView,
}: ContentViewActionMenuProps) {
  const popover = usePopover();

  return (
    <>
      <IconButton onClick={popover.onOpen}>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>
      <Popover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              onView(content);
              popover.onClose();
            }}
          >
            <Iconify icon="solar:eye-bold" />
            Xem chi tiết
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
