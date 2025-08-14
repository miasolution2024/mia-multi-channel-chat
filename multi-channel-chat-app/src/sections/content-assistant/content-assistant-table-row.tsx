import { useCallback } from 'react';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';

import { useBoolean } from '@/hooks/use-boolean';
import { Iconify } from '@/components/iconify';
import { ConfirmDialog } from '@/components/custom-dialog';
import { CustomPopover } from '@/components/custom-popover';
import { Label } from '@/components/label';
import { Content } from './view/content-assistant-list-view';

// ----------------------------------------------------------------------

type Props = {
  row: Content;
  selected: boolean;
  onSelectRow: () => void;
  onEditRow: (id: string) => void;
  onDeleteRow?: (id: string) => void;
};

export function ContentAssistantTableRow({ row, selected, onSelectRow, onEditRow, onDeleteRow }: Props) {
  const { id, topic, contentType, mainSeoKeyword, secondarySeoKeywords, customerGroup, customerJourney, status } = row;

  const confirm = useBoolean();

  const popover = useBoolean();

  const handleDelete = useCallback(() => {
    if (onDeleteRow) {
      onDeleteRow(id);
    }
    confirm.onFalse();
  }, [id, onDeleteRow]);

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
        
        <TableCell>{topic}</TableCell>

        <TableCell>{contentType}</TableCell>

        <TableCell>
          <Label variant="soft" color="primary">
            {mainSeoKeyword}
          </Label>
        </TableCell>

        <TableCell>
          {secondarySeoKeywords && secondarySeoKeywords.map((keyword, index) => (
            <Label
              key={index}
              variant="soft"
              color="info"
              sx={{ mr: 1, mb: 1 }}
            >
              {keyword}
            </Label>
          ))}
        </TableCell>

        <TableCell>{customerGroup}</TableCell>
        
        <TableCell>{customerJourney}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (status === 'Published' && 'success') ||
              (status === 'Draft' && 'warning') ||
              'default'
            }
          >
            {status}
          </Label>
        </TableCell>

        <TableCell align="right">
          <IconButton color="default" onClick={popover.onTrue}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.value}
        onClose={popover.onFalse}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onEditRow(id);
            popover.onFalse();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Chỉnh sửa
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onFalse();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Xóa
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Xóa"
        content="Bạn có chắc chắn muốn xóa?"
        action={
          <IconButton onClick={handleDelete}>
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        }
      />
    </>
  );
}