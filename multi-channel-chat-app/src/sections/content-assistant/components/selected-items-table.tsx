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
import { getKnowledgeBasedList } from "@/actions/knowledge-based";
import { ContentTone } from "@/sections/content-tone/types";
import { AiRule } from "@/sections/ai-rules/types";
import { KnowledgeBased } from "@/sections/knowledge-based/types";

type SelectionType = "content_tone" | "ai_rule_based" | "knowledge_based";

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
  const [items, setItems] = useState<(ContentTone | AiRule | KnowledgeBased)[]>(
    [],
  );

  useEffect(() => {
    const fetchSelectedItems = async () => {
      try {
        let allItems: (ContentTone | AiRule | KnowledgeBased)[] = [];

        if (type === "content_tone") {
          const data = await getContentTones(1, 100);
          allItems = data.data || [];
        } else if (type === "ai_rule_based") {
          const data = await getAiRules(1, 100);
          allItems = data.data || [];
        } else if (type === "knowledge_based") {
          const data = await getKnowledgeBasedList(1, 100);
          allItems = data.data || [];
        }

        // Filter only selected items
        const selectedItems = allItems.filter((item) =>
          selectedIds.includes(String(item.id)),
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

  const getDisplayText = (item: ContentTone | AiRule | KnowledgeBased) => {
    if (type === "content_tone") {
      return (item as ContentTone).tone_description;
    } else if (type === "ai_rule_based") {
      return (item as AiRule).content;
    } else {
      return (item as KnowledgeBased).content;
    }
  };

  const emptyText =
    type === "content_tone"
      ? "văn phong AI"
      : type === "ai_rule_based"
        ? "quy tắc AI"
        : "kiến thức cơ sở";

  const columnLabel =
    type === "content_tone"
      ? "Mô tả văn phong"
      : type === "ai_rule_based"
        ? "Nội dung quy tắc"
        : "Nội dung kiến thức";

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
          Chưa có {emptyText} nào được chọn
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
              <Typography variant="subtitle2">{columnLabel}</Typography>
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
                  onClick={() => onRemove(String(item.id))}
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
