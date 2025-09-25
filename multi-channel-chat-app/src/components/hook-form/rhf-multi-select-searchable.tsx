/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { Controller, useFormContext } from "react-hook-form";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Iconify } from "@/components/iconify";

// ----------------------------------------------------------------------

interface Option {
  value: any;
  label: string;
}

interface RHFMultiSelectSearchableProps {
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  chip?: boolean;
  checkbox?: boolean;
  required?: boolean;
  sx?: any;
  slotProps?: {
    inputLabel?: any;
    select?: any;
    chip?: any;
    checkbox?: any;
    formHelperText?: any;
  };
  // Data fetching props
  fetchData: (search: string, page: number, limit: number) => Promise<{
    data: Option[];
    total: number;
  }>;
  pageSize?: number;
  searchPlaceholder?: string;
}

export function RHFMultiSelectSearchable({
  name,
  chip,
  label,
  checkbox,
  placeholder,
  slotProps,
  helperText,
  required,
  sx,
  fetchData,
  pageSize = 50,
  searchPlaceholder = "Tìm kiếm...",
  ...other
}: RHFMultiSelectSearchableProps) {
  const { control } = useFormContext();
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const labelId = `${name}-select-label`;

  const loadData = useCallback(async (search: string, currentPage: number, reset = false) => {
    try {
      setLoading(true);
      const response = await fetchData(search, currentPage, pageSize);
      
      if (reset) {
        setOptions(response.data);
      } else {
        setOptions(prev => [...prev, ...response.data]);
      }
      
      setTotal(response.total);
      setHasMore(response.data.length === pageSize && options.length + response.data.length < response.total);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchData, pageSize, options.length]);

  // Initial load
  useEffect(() => {
    loadData("", 1, true);
  }, []);

  // Search handler
  const handleSearch = useCallback((search: string) => {
    setSearchTerm(search);
    setPage(1);
    setOptions([]);
    loadData(search, 1, true);
  }, [loadData]);

  // Load more handler
  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(searchTerm, nextPage, false);
    }
  }, [loading, hasMore, page, searchTerm, loadData]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={!!error} required={required} sx={sx} {...other}>
          {label && (
            <InputLabel htmlFor={labelId} {...slotProps?.inputLabel}>
              {label}
            </InputLabel>
          )}

          <Select
            {...field}
            multiple
            displayEmpty={!!placeholder}
            label={label}
            renderValue={(selected: any) => {
              const selectedItems = options.filter((item: Option) =>
                selected.includes(item.value)
              );

              if (!selectedItems.length && placeholder) {
                return <Box sx={{ color: "text.disabled" }}>{placeholder}</Box>;
              }

              if (chip) {
                return (
                  <Box sx={{ gap: 0.5, display: "flex", flexWrap: "wrap" }}>
                    {selectedItems.map((item: Option) => (
                      <Chip
                        key={item.value}
                        size="small"
                        variant="soft"
                        label={item.label}
                        {...slotProps?.chip}
                      />
                    ))}
                  </Box>
                );
              }

              return selectedItems.map((item: Option) => item.label).join(", ");
            }}
            MenuProps={{
              PaperProps: {
                sx: { maxHeight: 400 }
              }
            }}
            {...slotProps?.select}
            inputProps={{ id: labelId, ...slotProps?.select?.inputProps }}
          >
            {/* Search input */}
            <Box sx={{ p: 1, position: "sticky", top: 0, bgcolor: "background.paper", zIndex: 1 }}>
              <TextField
                size="small"
                fullWidth
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="eva:search-fill" />
                    </InputAdornment>
                  ),
                }}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              />
            </Box>

            {/* Options */}
            {options.map((option: Option) => (
              <MenuItem key={option.value} value={option.value}>
                {checkbox && (
                  <Checkbox
                    size="small"
                    disableRipple
                    checked={field.value.includes(option.value)}
                    {...slotProps?.checkbox}
                  />
                )}
                {option.label}
              </MenuItem>
            ))}

            {/* Loading indicator */}
            {loading && (
              <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            )}

            {/* Load more button */}
            {!loading && hasMore && options.length > 0 && (
              <Box sx={{ p: 1 }}>
                <Button
                  fullWidth
                  variant="text"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLoadMore();
                  }}
                  startIcon={<Iconify icon="eva:arrow-down-fill" />}
                >
                  Tải thêm ({options.length}/{total})
                </Button>
              </Box>
            )}

            {/* No results */}
            {!loading && options.length === 0 && (
              <Box sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  {searchTerm ? "Không tìm thấy kết quả" : "Không có dữ liệu"}
                </Typography>
              </Box>
            )}
          </Select>

          {(!!error || helperText) && (
            <FormHelperText error={!!error} {...slotProps?.formHelperText}>
              {error ? error?.message : helperText}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}