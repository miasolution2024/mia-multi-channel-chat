"use client";

import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Popover from "@mui/material/Popover";

import { useSetState } from "@/hooks/use-set-state";
import { paths } from "@/routes/path";
import { DashboardContent } from "@/layouts/dashboard";
import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import { Iconify } from "@/components/iconify";
import { toast } from "@/components/snackbar";
import { ConfirmDialog } from "@/components/custom-dialog";
import { useBoolean } from "@/hooks/use-boolean";
import { CustomTable } from "@/components/custom-table";
import type {
  TableConfig,
  DataItem,
} from "@/components/custom-table/custom-table";
import { usePopover } from "@/components/custom-popover";

import {
  getContentTones,
  deleteContentTone,
  getContentToneList,
} from "@/actions/content-tone";
import { ContentTone } from "../types";
import { InputAdornment, TextField } from "@mui/material";
import { useDebounce } from "@/hooks/use-debounce";

// ----------------------------------------------------------------------

const TABLE_HEAD: TableConfig<DataItem>[] = [
  { key: "id", label: "ID", align: "left" },
  { key: "tone_description", label: "Mô tả", align: "left" },
  { key: "", label: "", align: "right" },
];

// ----------------------------------------------------------------------

type ContentToneActionMenuProps = {
  onEdit: VoidFunction;
  onDelete: VoidFunction;
};

function ContentToneActionMenu({
  onEdit,
  onDelete,
}: ContentToneActionMenuProps) {
  const popover = usePopover();

  return (
    <>
      <IconButton color="default" onClick={popover.onOpen}>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>

      <Popover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: { width: 160 },
          },
        }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              popover.onClose();
              onEdit();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Chỉnh sửa
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
              onDelete();
            }}
            sx={{ color: "error.main" }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Xóa
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}

// ----------------------------------------------------------------------

export function ContentToneListView() {
  const router = useRouter();
  const [tones, setTones] = useState<ContentTone[]>([]);
  const [selectedToneId, setSelectedToneId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0); // 0-based for MUI pagination
  const [pageSize, setPageSize] = useState<number>(20); // Default to 20 items per page

  const confirm = useBoolean();

  const filters = useSetState({
    tone_description: "",
  });

  const debouncedToneDescription = useDebounce(
    filters.state.tone_description,
    500
  );

  useEffect(() => {
    const fetchTones = async () => {
      try {
        setLoading(true);
        //const data = await getContentTones(page + 1, pageSize); // Convert to 1-based for API
        const data = await getContentToneList({
          tone_description: debouncedToneDescription || undefined,
          page: page + 1,
          pageSize,
        });
        setTones(
          (data.data || []).map((item) => ({
            id: item.id,
            tone_description: item.tone_description,
            // add other fields as needed to match ContentTone type
          }))
        );
        setTotalCount(data.total || 0);
        // setTotalCount(data.meta?.total_count || 0);
      } catch (error) {
        console.error("Error fetching content tones:", error);
        toast.error("Không thể tải danh sách văn phong AI");
      } finally {
        setLoading(false);
      }
    };

    fetchTones();
  }, [page, pageSize, debouncedToneDescription]); // Re-fetch when page or pageSize changes

  useEffect(() => {
    if (page !== 0) setPage(0);
  }, [debouncedToneDescription, page]);

  // const dataFiltered = tones.filter((tone) => {
  //   if (
  //     filters.state.tone_description &&
  //     !tone.tone_description
  //       .toLowerCase()
  //       .includes(filters.state.tone_description.toLowerCase())
  //   ) {
  //     return false;
  //   }
  //   return true;
  // });

  const canReset = !!filters.state.tone_description;

  const handleResetFilters = useCallback(() => {
    filters.setState({ tone_description: "" });
  }, [filters]);

  const handleEdit = useCallback(
    (id: string) => {
      router.push(paths.dashboard.contentTone.edit(id));
    },
    [router]
  );

  const handleDelete = useCallback(
    (id: string) => {
      setSelectedToneId(id);
      confirm.onTrue();
    },
    [confirm]
  );

  // Handle page change
  const handleChangePage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage);
    },
    []
  );

  // Handle rows per page change
  const handleChangePageSize = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPageSize(parseInt(event.target.value, 10));
      setPage(0); // Reset to first page when changing page size
    },
    []
  );

  const handleConfirmDelete = useCallback(async () => {
    if (selectedToneId) {
      try {
        await deleteContentTone(selectedToneId);
        // Refresh the current page after deletion
        const data = await getContentTones(page + 1, pageSize);
        setTones(data.data || []);
        setTotalCount(data.meta?.total_count || 0);

        toast.success("Xóa văn phong AI thành công!");
      } catch (error) {
        console.error("Error deleting content tone:", error);
        toast.error("Không thể xóa văn phong AI");
      } finally {
        setSelectedToneId(null);
        confirm.onFalse();
      }
    }
  }, [selectedToneId, confirm, page, pageSize]);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Văn phong AI"
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            { name: "Văn phong AI", href: paths.dashboard.contentTone.root },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => router.push(paths.dashboard.contentTone.new)}
            >
              Thêm mới
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <Box
            sx={{
              p: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              flexWrap: { xs: "wrap", md: "nowrap" },
            }}
          >
            <TextField
              value={filters.state.tone_description}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                filters.setState({ tone_description: event.target.value })
              }
              placeholder="Tìm kiếm mô tả..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify
                      icon="eva:search-fill"
                      sx={{ color: "text.disabled" }}
                    />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 240 }}
            />

            {canReset && (
              <Button
                color="error"
                sx={{ flexShrink: 0 }}
                onClick={handleResetFilters}
                startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              >
                Xóa
              </Button>
            )}
          </Box>

          <CustomTable
            data={tones}
            loading={loading}
            tableConfig={TABLE_HEAD.map((col) => ({
              ...col,
              render:
                col.key === "id" || col.key === "tone_description"
                  ? (item: DataItem) => {
                      const tone = item as ContentTone;
                      return (
                        <Box
                          sx={{ cursor: "pointer" }}
                          onClick={() => handleEdit(tone.id as string)}
                        >
                          {String(item[col.key])}
                        </Box>
                      );
                    }
                  : undefined,
            }))}
            moreOptions={(item) => {
              const row = item as ContentTone;
              return (
                <ContentToneActionMenu
                  key="actions"
                  onEdit={() => handleEdit(row.id as string)}
                  onDelete={() => handleDelete(row.id as string)}
                />
              );
            }}
            count={totalCount}
            page={page}
            pageSize={pageSize}
            onChangePage={handleChangePage}
            onChangePageSize={handleChangePageSize}
          />
        </Card>
      </DashboardContent>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Xóa"
        content="Bạn có chắc chắn muốn xóa văn phong AI này?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
          >
            Xóa
          </Button>
        }
      />
    </>
  );
}
