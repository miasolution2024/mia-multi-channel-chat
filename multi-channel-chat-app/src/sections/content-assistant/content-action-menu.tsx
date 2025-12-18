import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Popover from "@mui/material/Popover";

import { Iconify } from "@/components/iconify";
import { usePopover } from "@/components/custom-popover";
import type { Content } from "./view/content-assistant-list-view";

interface ContentActionMenuProps {
  content: Content;
  onEdit: (id: string | number) => void;
  onDelete: (id: string | number) => void;
  onPublish: (id: string | number) => void;
}

export function ContentActionMenu({
  content,
  onEdit,
  onDelete,
  onPublish,
}: ContentActionMenuProps) {
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
              onEdit(content.id);
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Chỉnh sửa
          </MenuItem>

          <MenuItem
            onClick={() => {
              onPublish(content.id);
              popover.onClose();
            }}
          >
            <Iconify icon={"solar:upload-bold"} />
            {"Xuất bản"}
          </MenuItem>

          <MenuItem
            onClick={() => {
              onDelete(content.id);
              popover.onClose();
            }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Xóa
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
