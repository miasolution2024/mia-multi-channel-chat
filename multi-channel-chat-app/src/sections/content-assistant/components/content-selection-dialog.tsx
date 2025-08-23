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
import { toast } from "@/components/snackbar";
import { getContentTones } from "@/actions/content-tone";
import { getAiRules } from "@/actions/ai-rules";
import { ContentTone } from "@/sections/content-tone/types";
import { AiRule } from "@/sections/ai-rules/types";

type SelectionType = "content_tone" | "ai_rule_based";

interface ContentSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  type: SelectionType;
  selectedIds: string[];
  onConfirm: (selectedIds: string[]) => void;
}

export function ContentSelectionDialog({
  open,
  onClose,
  type,
  selectedIds,
  onConfirm,
}: ContentSelectionDialogProps) {
  const [items, setItems] = useState<(ContentTone | AiRule)[]>([]);
  const [loading, setLoading] = useState(false);
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>(selectedIds);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      let data;

      if (type === "content_tone") {
        data = await getContentTones(1, 100); // Get first 100 items
        setItems(data.data || []);
      } else {
        data = await getAiRules(1, 100); // Get first 100 items
        setItems(data.data || []);
      }
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      toast.error(
        `Không thể tải danh sách ${
          type === "content_tone" ? "văn phong AI" : "quy tắc AI"
        }`
      );
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    if (open) {
      setTempSelectedIds(selectedIds);
      fetchItems();
    }
  }, [fetchItems, open, selectedIds]);

  const handleToggleItem = (id: string) => {
    setTempSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (tempSelectedIds.length === items.length) {
      setTempSelectedIds([]);
    } else {
      setTempSelectedIds(items.map((item) => item.id));
    }
  };

  const handleConfirm = () => {
    onConfirm(tempSelectedIds);
    onClose();
  };

  const getDisplayText = (item: ContentTone | AiRule) => {
    if (type === "content_tone") {
      return (item as ContentTone).tone_description;
    }
    return (item as AiRule).content;
  };

  const title =
    type === "content_tone" ? "Chọn văn phong AI" : "Chọn quy tắc AI";
  const isAllSelected =
    tempSelectedIds.length === items.length && items.length > 0;
  const isIndeterminate =
    tempSelectedIds.length > 0 && tempSelectedIds.length < items.length;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {loading ? (
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
                      {type === "content_tone"
                        ? "Mô tả văn phong"
                        : "Nội dung quy tắc"}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id} hover sx={{ cursor: "pointer" }}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={tempSelectedIds.includes(item.id)}
                        onChange={() => handleToggleItem(item.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {getDisplayText(item)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && (
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
        <Button onClick={handleConfirm} variant="contained" disabled={loading}>
          Xác nhận ({tempSelectedIds.length})
        </Button>
      </DialogActions>
    </Dialog>
  );
}
