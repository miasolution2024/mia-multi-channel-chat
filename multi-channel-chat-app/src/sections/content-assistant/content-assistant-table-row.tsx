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
  onEditRow: (id: string | number) => void;
  onDeleteRow?: (id: string | number) => void;
};

export function ContentAssistantTableRow({ row, selected, onSelectRow, onEditRow, onDeleteRow }: Props) {
  const { id, topic, post_type, main_seo_keyword, secondary_seo_keywords, customer_group, customer_journey, status } = row;

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

        <TableCell>{post_type || 'N/A'}</TableCell>

        <TableCell>
          <Label variant="soft" color="primary">
            {main_seo_keyword}
          </Label>
        </TableCell>

        <TableCell>
          {secondary_seo_keywords && secondary_seo_keywords.map((keyword: string, index: number) => (
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

        <TableCell>
          {customer_group.map((group, index) => (
            <Label key={index} variant="soft" color="default" sx={{ mr: 1 }}>
              {group.customer_group_id.name}
            </Label>
          ))}
        </TableCell>
        
        <TableCell>
          {customer_journey.map((journey, index) => (
            <Label key={index} variant="soft" color="info" sx={{ mr: 1 }}>
              {journey.customer_journey_id.name}
            </Label>
          ))}
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (status === 'published' && 'success') ||
              (status === 'draft' && 'warning') ||
              'default'
            }
          >
            {status === 'published' ? 'Đã xuất bản' : 'Nháp'}
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