"use client";

import { useState, useEffect } from "react";
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
import { getContentTones } from "@/actions/content-tone";
import { getAiRules } from "@/actions/ai-rules";
import { ContentTone } from "@/sections/content-tone/types";
import { AiRule } from "@/sections/ai-rules/types";

type SelectionType = "content_tone" | "ai_rule_based";

interface SelectedItemsTableProps {
  type: SelectionType;
  selectedIds: string[];
  onRemove: (id: string) => void;
}

export function SelectedItemsTable({
  type,
  selectedIds,
  onRemove,
}: SelectedItemsTableProps) {
  const [items, setItems] = useState<(ContentTone | AiRule)[]>([]);

  useEffect(() => {
    const fetchSelectedItems = async () => {
      try {
        let allItems: (ContentTone | AiRule)[] = [];

        if (type === "content_tone") {
          const data = await getContentTones(1, 100);
          allItems = data.data || [];
        } else {
          const data = await getAiRules(1, 100);
          allItems = data.data || [];
        }

        // Filter only selected items
        const selectedItems = allItems.filter((item) =>
          selectedIds.includes(item.id)
        );
        setItems(selectedItems);
      } catch (error) {
        console.error(`Error fetching selected ${type}:`, error);
      }
    };

    if (selectedIds.length > 0) {
      fetchSelectedItems();
    } else {
      setItems([]);
    }
  }, [selectedIds, type]);

  const getDisplayText = (item: ContentTone | AiRule) => {
    if (type === "content_tone") {
      return (item as ContentTone).tone_description;
    }
    return (item as AiRule).content;
  };

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
          Chưa có {type === "content_tone" ? "văn phong AI" : "quy tắc AI"} nào
          được chọn
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
                {type === "content_tone"
                  ? "Mô tả văn phong"
                  : "Nội dung quy tắc"}
              </Typography>
            </TableCell>
            <TableCell width={60} align="center">
              <Typography variant="subtitle2">Thao tác</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} hover>
              <TableCell>
                <Typography variant="body2">{getDisplayText(item)}</Typography>
              </TableCell>
              <TableCell align="center">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onRemove(item.id)}
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
