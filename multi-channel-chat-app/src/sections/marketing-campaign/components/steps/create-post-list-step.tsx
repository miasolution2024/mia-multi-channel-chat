import {
  RHFTextField,
} from "@/components/hook-form";
import { Iconify } from "@/components/iconify";
import CustomTable from "@/components/custom-table/custom-table";
import type { TableConfig } from "@/components/custom-table/custom-table";

import {
  Stack,
  IconButton,
  Typography,
  Box,
  Chip,
  TextField,
  ClickAwayListener,
} from "@mui/material";
import { useState } from "react";

// Define the data structure for ai_content_suggestions
interface ContentSuggestionItem {
  id: string;
  topic: string;
  main_seo_keyword: string;
  secondary_seo_keywords: string[];
  customer_journey: number;
  post_type: string;
  content_tone: number[];
  ai_notes_write_article: string;
  [key: string]: unknown; // Add index signature to match DataItem interface
}

// Fake data for ai_content_suggestions
const FAKE_CONTENT_SUGGESTIONS: ContentSuggestionItem[] = [
  {
    id: "1",
    topic: "Xu hướng marketing số 2024",
    main_seo_keyword: "marketing số",
    secondary_seo_keywords: ["digital marketing", "xu hướng 2024", "chiến lược marketing"],
    customer_journey: 1,
    post_type: "blog",
    content_tone: [1, 2],
    ai_notes_write_article: "Tập trung vào các xu hướng mới nhất trong marketing số, bao gồm AI và automation"
  },
  {
    id: "2", 
    topic: "Cách tối ưu SEO cho website",
    main_seo_keyword: "tối ưu SEO",
    secondary_seo_keywords: ["SEO website", "tối ưu hóa", "thứ hạng Google"],
    customer_journey: 2,
    post_type: "tutorial",
    content_tone: [1, 3],
    ai_notes_write_article: "Hướng dẫn chi tiết các bước tối ưu SEO cơ bản và nâng cao"
  },
  {
    id: "3",
    topic: "Social Media Marketing hiệu quả",
    main_seo_keyword: "social media marketing",
    secondary_seo_keywords: ["mạng xã hội", "marketing Facebook", "Instagram marketing"],
    customer_journey: 1,
    post_type: "guide",
    content_tone: [2, 4],
    ai_notes_write_article: "Chia sẻ kinh nghiệm và chiến lược marketing trên các nền tảng mạng xã hội"
  }
];

export function CreatePostListStep() {
  const [contentSuggestions, setContentSuggestions] = useState<ContentSuggestionItem[]>(FAKE_CONTENT_SUGGESTIONS);
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  // Handle delete item from list
  const handleDeleteItem = (id: string) => {
    setContentSuggestions(prev => prev.filter(item => item.id !== id));
  };

  // Handle start editing
  const handleStartEdit = (id: string, field: string, currentValue: string | string[] | number[]) => {
    let valueToEdit = '';
    if (Array.isArray(currentValue)) {
      valueToEdit = currentValue.join(', ');
    } else {
      valueToEdit = String(currentValue);
    }
    
    setEditingCell({ id, field });
    setEditValue(valueToEdit);
  };

  // Handle save edit
  const handleSaveEdit = () => {
    if (editingCell) {
      const { id, field } = editingCell;
      setContentSuggestions(prev => 
        prev.map(item => {
          if (item.id === id) {
            if (field === 'secondary_seo_keywords') {
              return { 
                ...item, 
                [field]: editValue.split(',').map(keyword => keyword.trim()).filter(keyword => keyword.length > 0)
              };
            } else if (field === 'content_tone') {
              return { 
                ...item, 
                [field]: editValue.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num))
              };
            } else {
              return { ...item, [field]: editValue };
            }
          }
          return item;
        })
      );
      setEditingCell(null);
      setEditValue('');
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingCell(null);
    setEditValue("");
  };

  // Check if cell is being edited
  const isCellEditing = (id: string, field: string) => {
    return editingCell?.id === id && editingCell?.field === field;
  };

  // Table configuration
  const TABLE_CONFIG: TableConfig[] = [
    { 
      key: "topic", 
      label: "Chủ đề", 
      align: "left", 
      width: 180,
      render: (item) => {
        const suggestion = item as ContentSuggestionItem;
        const isEditing = isCellEditing(suggestion.id, 'topic');
        
        if (isEditing) {
          return (
            <ClickAwayListener onClickAway={handleSaveEdit}>
              <TextField
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
                size="small"
                fullWidth
                autoFocus
                sx={{ maxWidth: 170 }}
              />
            </ClickAwayListener>
          );
        }
        
        return (
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 180,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'action.hover',
                borderRadius: 1,
                padding: '2px 4px',
                margin: '-2px -4px'
              }
            }}
            onClick={() => handleStartEdit(suggestion.id, 'topic', suggestion.topic)}
          >
            {suggestion.topic}
          </Typography>
        );
      }
    },
    { 
      key: "main_seo_keyword", 
      label: "Từ khóa chính", 
      align: "left", 
      width: 140,
      render: (item) => {
        const suggestion = item as ContentSuggestionItem;
        const isEditing = isCellEditing(suggestion.id, 'main_seo_keyword');
        
        if (isEditing) {
          return (
            <ClickAwayListener onClickAway={handleSaveEdit}>
              <TextField
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
                size="small"
                fullWidth
                autoFocus
                sx={{ maxWidth: 130 }}
              />
            </ClickAwayListener>
          );
        }
        
        return (
          <Chip
            label={suggestion.main_seo_keyword}
            size="small"
            variant="outlined"
            color="primary"
            onClick={() => handleStartEdit(suggestion.id, 'main_seo_keyword', suggestion.main_seo_keyword)}
            sx={{ 
              maxWidth: 130,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'primary.lighter'
              },
              '& .MuiChip-label': {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '100%'
              }
            }}
          />
        );
      }
    },
    { 
      key: "secondary_seo_keywords", 
      label: "Từ khóa phụ", 
      align: "left", 
      width: 200,
      render: (item) => {
        const suggestion = item as ContentSuggestionItem;
        const isEditing = isCellEditing(suggestion.id, 'secondary_seo_keywords');
        
        if (isEditing) {
          return (
            <ClickAwayListener onClickAway={handleSaveEdit}>
              <TextField
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
                size="small"
                fullWidth
                autoFocus
                placeholder="Nhập từ khóa, cách nhau bằng dấu phẩy"
                sx={{ maxWidth: 190 }}
              />
            </ClickAwayListener>
          );
        }
        
        return (
          <Stack 
            direction="row" 
            spacing={0.5} 
            sx={{ 
              flexWrap: 'wrap', 
              gap: 0.5,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'action.hover',
                borderRadius: 1,
                padding: '2px 4px',
                margin: '-2px -4px'
              }
            }}
            onClick={() => handleStartEdit(suggestion.id, 'secondary_seo_keywords', suggestion.secondary_seo_keywords)}
          >
            {suggestion.secondary_seo_keywords.map((keyword, index) => (
              <Chip
                key={index}
                label={keyword}
                size="small"
                variant="outlined"
                color="secondary"
                sx={{ 
                  maxWidth: 90,
                  '& .MuiChip-label': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '100%'
                  }
                }}
              />
            ))}
          </Stack>
        );
      }
    },
    { 
      key: "customer_journey", 
      label: "Customer Journey", 
      align: "center", 
      width: 100
    },
    { 
      key: "post_type", 
      label: "Loại bài viết", 
      align: "center", 
      width: 100,
      render: (item) => {
        const suggestion = item as ContentSuggestionItem;
        return (
          <Typography 
            variant="body2" 
            sx={{ 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 100
            }}
          >
            {suggestion.post_type}
          </Typography>
        );
      }
    },
    { 
      key: "content_tone", 
      label: "Văn phong AI", 
      align: "center", 
      width: 100,
      render: (item) => {
        const suggestion = item as ContentSuggestionItem;
        const isEditing = isCellEditing(suggestion.id, 'content_tone');
        
        if (isEditing) {
          return (
            <ClickAwayListener onClickAway={handleSaveEdit}>
              <TextField
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
                size="small"
                fullWidth
                autoFocus
                placeholder="Nhập số, cách nhau bằng dấu phẩy"
                sx={{ maxWidth: 90 }}
              />
            </ClickAwayListener>
          );
        }
        
        return (
          <Typography 
            variant="body2"
            onClick={() => handleStartEdit(suggestion.id, 'content_tone', suggestion.content_tone)}
            sx={{ 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 100,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'action.hover',
                borderRadius: 1,
                padding: '2px 4px',
                margin: '-2px -4px'
              }
            }}
          >
            {suggestion.content_tone.join(", ")}
          </Typography>
        );
      }
    },
    { 
      key: "ai_notes_write_article", 
      label: "Ghi chú AI", 
      align: "left", 
      width: 200,
      render: (item) => {
        const suggestion = item as ContentSuggestionItem;
        const isEditing = isCellEditing(suggestion.id, 'ai_notes_write_article');
        
        if (isEditing) {
          return (
            <ClickAwayListener onClickAway={handleSaveEdit}>
              <TextField
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
                size="small"
                fullWidth
                multiline
                rows={2}
                autoFocus
                sx={{ maxWidth: 190 }}
              />
            </ClickAwayListener>
          );
        }
        
        return (
          <Typography 
            variant="body2" 
            onClick={() => handleStartEdit(suggestion.id, 'ai_notes_write_article', suggestion.ai_notes_write_article)}
            sx={{ 
              fontSize: '0.875rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 200,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'action.hover',
                borderRadius: 1,
                padding: '2px 4px',
                margin: '-2px -4px'
              }
            }}
          >
            {suggestion.ai_notes_write_article}
          </Typography>
        );
      }
    },
    {
      key: "actions",
      label: "Thao tác",
      align: "center",
      width: 80,
      sticky: "right",
      render: (item) => {
        const suggestion = item as ContentSuggestionItem;
        return (
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDeleteItem(suggestion.id)}
            sx={{ 
              '&:hover': { 
                backgroundColor: 'error.lighter' 
              } 
            }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" width={18} />
          </IconButton>
        );
      }
    }
  ];

  return (
    <Stack spacing={3}>
      <Stack spacing={2}>
        <RHFTextField
          name="ai_create_post_detail_notes"
          placeholder="Viết thêm mô tả chi tiết và lưu ý bài viết"
          multiline
          minRows={1}
          maxRows={4}
          InputProps={{
            startAdornment: (
              <Iconify
                icon="solar:magic-stick-3-bold"
                sx={{
                  color: "primary.main",
                  mr: 1,
                  fontSize: 20,
                }}
              />
            ),
            sx: {
              alignItems: "flex-start",
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              transition: "all 0.3s ease",
              backgroundColor: "background.paper",
              "&:hover": {
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              },
              "&.Mui-focused": {
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              },
            },
          }}
        />
      </Stack>

      {/* Content Suggestions Table */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Danh sách gợi ý nội dung
        </Typography>
        <CustomTable
          data={contentSuggestions}
          tableConfig={TABLE_CONFIG}
          firstLoading={false}
          loading={false}
        />
      </Box>
    </Stack>
  );
}
