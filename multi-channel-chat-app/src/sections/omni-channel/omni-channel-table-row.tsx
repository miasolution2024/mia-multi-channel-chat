import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import { useBoolean } from "@/hooks/use-boolean";
import { usePopover } from "@/components/custom-popover";
import { Iconify } from "@/components/iconify";
import { ConfirmDialog } from "@/components/custom-dialog";
import { mutate } from "swr";
import { useCallback } from "react";
import { endpoints } from "@/utils/axios";
import { toast } from "@/components/snackbar";
import { OmniChannel } from "@/models/omni-channel/omni-channel";
import { fDate } from "@/utils/format-time";
import { Label } from "@/components/label";
// ----------------------------------------------------------------------

export interface OmniChannelsTableRowProps {
  row: OmniChannel;
  selected: boolean;
  onSelectRow: VoidFunction;
  onEditRow: (id: string | number) => void;
}

export function OmniChannelsTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
}: OmniChannelsTableRowProps) {
  const confirm = useBoolean();

  const popover = usePopover();

  const handleDeleteRow = useCallback(async () => {
    // await deleteOmniChannelsAsync(row.id);

    mutate(endpoints.omniChannels.list);

    toast.success("Delete success!");
  }, [row.id]);

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell padding="checkbox">
          <Checkbox id={row.id} checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ whiteSpace: "nowrap" }}>{row.id}</TableCell>
        <TableCell sx={{ whiteSpace: "nowrap" }}>{row.page_id}</TableCell>
        <TableCell sx={{ whiteSpace: "nowrap" }}>{row.page_name}</TableCell>
        <TableCell sx={{ whiteSpace: "nowrap" }}>{row.source}</TableCell>
        <TableCell>
          <Label
            variant="soft"
            color={
              (row.is_enabled && "success") ||
              (!row.is_enabled && "error") ||
              "default"
            }
          >
            {row.is_enabled ? "Enabled" : "Disabled"}
          </Label>
        </TableCell>
        <TableCell sx={{ whiteSpace: "nowrap" }}>
          {fDate(row.expired_date)}
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center">
            <Tooltip title="Edit" placement="top" arrow>
              <IconButton color="inherit" onClick={() => onEditRow(row.id)}>
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete" placement="top" arrow>
              <IconButton
                color="error"
                onClick={() => {
                  confirm.onTrue();
                  popover.onClose();
                }}
              >
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Tooltip>
          </Stack>
        </TableCell>
      </TableRow>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={handleDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
