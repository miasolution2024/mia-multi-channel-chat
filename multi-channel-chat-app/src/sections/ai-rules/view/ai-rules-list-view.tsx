'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import {
  Box,
  Card,
  Stack,
  Button,
  Container,
  Typography,
  IconButton,
  MenuList,
  MenuItem,
} from '@mui/material';

import { paths } from '@/routes/path';
import { DashboardContent } from '@/layouts/dashboard';
import { Iconify } from '@/components/iconify';
import { Scrollbar } from '@/components/scrollbar';
import { ConfirmDialog } from '@/components/custom-dialog';
import { useBoolean } from '@/hooks/use-boolean';
import { CustomTable } from '@/components/custom-table';
import type { TableConfig, DataItem } from '@/components/custom-table/custom-table';
import { usePopover, CustomPopover } from '@/components/custom-popover';
import { toast } from '@/components/snackbar';
import { getAiRules, deleteAiRule } from '@/actions/ai-rules';

import { AiRule } from '../types';

// ----------------------------------------------------------------------

interface AiRuleActionMenuProps {
  rule: AiRule;
  onEdit: () => void;
  onDelete: () => void;
}

function AiRuleActionMenu({ onEdit, onDelete }: AiRuleActionMenuProps) {
  const popover = usePopover();

  return (
    <>
      <IconButton onClick={popover.onOpen}>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              onEdit();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Cập nhật
          </MenuItem>

          <MenuItem
            onClick={() => {
              onDelete();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Xóa
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}

const TABLE_HEAD: TableConfig<DataItem>[] = [
  { key: 'id', label: 'ID', align: 'left' },
  { key: 'content', label: 'Nội dung', align: 'left' },
  {
    key: 'actions',
    label: 'Hành động',
    align: 'center',
    render: (item: DataItem) => (
      <AiRuleActionMenu
        rule={item as AiRule}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    ),
  },
];

// ----------------------------------------------------------------------

export function AiRulesListView() {
  const router = useRouter();
  const confirm = useBoolean();
  const loading = useBoolean(true);

  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);
  const [rules, setRules] = useState<AiRule[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0); // 0-based for MUI pagination
  const [pageSize, setPageSize] = useState<number>(20); // Default to 20 items per page

  // Fetch AI rules with pagination
  useEffect(() => {
    const fetchRules = async () => {
      try {
        loading.onTrue();
        const response = await getAiRules(page + 1, pageSize); // Convert to 1-based for API
        setRules(response.data || []);
        setTotalCount(response.meta?.total_count || 0);
      } catch (error) {
        console.error('Error fetching AI rules:', error);
        toast.error('Không thể tải danh sách quy tắc AI');
      } finally {
        loading.onFalse();
      }
    };

    fetchRules();
  }, [page, pageSize]); // Re-fetch when page or pageSize changes

  const handleDeleteConfirm = useCallback(async () => {
    if (selectedRuleId) {
      try {
        await deleteAiRule(selectedRuleId);
        
        // Refresh the current page after deletion
        const response = await getAiRules(page + 1, pageSize);
        setRules(response.data || []);
        setTotalCount(response.meta?.total_count || 0);
        
        toast.success('Xóa quy tắc thành công!');
      } catch (error) {
        console.error('Error deleting AI rule:', error);
        toast.error('Không thể xóa quy tắc AI');
      } finally {
        setSelectedRuleId(null);
        confirm.onFalse();
      }
    }
  }, [selectedRuleId, confirm, page, pageSize]);

  const handleDeleteClick = useCallback(
    (ruleId: string) => {
      setSelectedRuleId(ruleId);
      confirm.onTrue();
    },
    [confirm]
  );
  
  // Handle page change
  const handleChangePage = useCallback((event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  }, []);
  
  // Handle rows per page change
  const handleChangePageSize = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when changing page size
  }, []);

  return (
    <>
      <DashboardContent>
        <Container maxWidth="xl">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: { xs: 3, md: 5 } }}
          >
            <Typography variant="h4">Quy tắc AI</Typography>

            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => router.push(paths.dashboard.aiRules.new)}
            >
              Thêm quy tắc mới
            </Button>
          </Stack>

          <Card>
            <Box sx={{ position: 'relative' }}>
              <Scrollbar sx={{ minHeight: 444 }}>
                <CustomTable
                  data={rules}
                  tableConfig={TABLE_HEAD.map((col) => ({
                    ...col,
                    render: col.key === 'actions' ? (item: DataItem) => (
                      <AiRuleActionMenu
                        rule={item as AiRule}
                        onEdit={() => router.push(paths.dashboard.aiRules.edit(item.id as string))}
                        onDelete={() => handleDeleteClick(item.id as string)}
                      />
                    ) : undefined,
                  }))}
                  loading={loading.value}
                  firstLoading={loading.value}
                  count={totalCount}
                  page={page}
                  pageSize={pageSize}
                  onChangePage={handleChangePage}
                  onChangePageSize={handleChangePageSize}
                />
              </Scrollbar>
            </Box>
          </Card>
        </Container>
      </DashboardContent>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Xóa quy tắc"
        content="Bạn có chắc chắn muốn xóa quy tắc này không?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
          >
            Xóa
          </Button>
        }
      />
    </>
  );
}