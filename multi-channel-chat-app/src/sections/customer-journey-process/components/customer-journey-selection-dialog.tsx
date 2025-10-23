"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useGetCustomerJourneys } from "@/hooks/apis/use-get-customer-journeys";


interface CustomerJourneySelectionDialogProps {
  open: boolean;
  onClose: () => void;
  selectedIds: string[];
  onConfirm: (selectedIds: string[]) => void;
}

export function CustomerJourneySelectionDialog({
  open,
  onClose,
  selectedIds,
  onConfirm,
}: CustomerJourneySelectionDialogProps) {
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>(selectedIds);
const {data: customerJourneys, isLoading} = useGetCustomerJourneys({
  limit: 200,
  isNotInCustomerJourneyProcess: true,
});
  useEffect(() => {
    if (open) {
      setTempSelectedIds(selectedIds);
    }
  }, [open, selectedIds]);

  const handleToggleItem = (id: string) => {
    setTempSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = useCallback(() => {
    if (tempSelectedIds.length === customerJourneys.length) {
      setTempSelectedIds([]);
    } else {
      setTempSelectedIds(
        customerJourneys.map((item) => String(item.id))
      );
    }
  }, [customerJourneys, tempSelectedIds]);

  const handleConfirm = () => {
    onConfirm(tempSelectedIds);
    onClose();
  };

  const isAllSelected =
    tempSelectedIds.length === customerJourneys.length && customerJourneys.length > 0;
  const isIndeterminate =
    tempSelectedIds.length > 0 && tempSelectedIds.length < customerJourneys.length;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Chọn hành trình khách hàng</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isAllSelected}
                      indeterminate={isIndeterminate}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">
                      Tên hành trình
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customerJourneys.map((item) => (
                  <TableRow key={item.id} hover sx={{ cursor: "pointer" }}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={tempSelectedIds.includes(String(item.id))}
                        onChange={() => handleToggleItem(String(item.id))}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {item.name}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
                {customerJourneys.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      <Typography variant="body2" color="text.secondary">
                        Không có dữ liệu
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleConfirm} variant="contained" disabled={isLoading}>
          Xác nhận ({tempSelectedIds.length})
        </Button>
      </DialogActions>
    </Dialog>
  );
}
