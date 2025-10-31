"use client";

import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import { Iconify } from "@/components/iconify";
import { useGetCustomerJourneys } from "@/hooks/apis/use-get-customer-journeys";

interface SelectedItemsTableProps {
  selectedIds: string[];
  onRemove: (id: string) => void;
}

export function SelectedItemsTable({
  selectedIds,
  onRemove,
}: SelectedItemsTableProps) {
  const { data } = useGetCustomerJourneys({
    limit: 200,
  });

  const items = useMemo(() => {
    return data?.filter((item) => selectedIds.includes(item.id.toString())) || [];
  }, [data, selectedIds]);

  if (selectedIds.length === 0) {
    return (
      <Box
        sx={{
          p: 3,
          textAlign: "center",
          border: "1px dashed",
          borderColor: "divider",
          borderRadius: 1,
          bgcolor: "background.neutral",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Chưa có hành trình nào được chọn
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="subtitle2">
                Tên hành trình
              </Typography>
            </TableCell>
            <TableCell width={60} align="center">
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} hover>
              <TableCell>
                <Typography variant="body2">{item.name}</Typography>
              </TableCell>
              <TableCell align="center">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onRemove(item.id.toString())}
                >
                  <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
