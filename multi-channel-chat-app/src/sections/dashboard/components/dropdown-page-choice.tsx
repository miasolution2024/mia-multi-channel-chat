/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useGetPostSocialChannel } from "@/actions/dashboard-channels";
import { Iconify } from "@/components/iconify";
import {
  FormControl,
  MenuItem,
  Select,
  Checkbox,
  ListItemText,
  SelectChangeEvent,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { OmniChoices } from "../type";

interface DropdownPageChoiceProps {
  value: OmniChoices[];
  onChange: (value: OmniChoices[]) => void;
}

const DropdownPageChoice: React.FC<DropdownPageChoiceProps> = ({
  value,
  onChange,
}) => {
  const [pages, setPages] = useState<OmniChoices[]>([]);
  const { postSocialData } = useGetPostSocialChannel();

  useEffect(() => {
    if (postSocialData?.data) {
      const apiPages: OmniChoices[] = postSocialData.data.map(
        (item: any, index: number) => ({
          id: index + 1,
          page_id: item.page_id,
          page_name: item.page_name,
          token: item.token,
        })
      );
      setPages(apiPages);
    }
  }, [postSocialData]);

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const selectedPageIds = event.target.value as string[];

    const selectedPages = pages.filter((page) =>
      selectedPageIds.includes(page.page_id)
    );

    onChange(selectedPages);
  };

  const renderValue = () => {
    if (value.length === 0) {
      return "Chọn trang";
    }

    const selectedPageNames = value.map((choices) => choices.page_name);
    return selectedPageNames.join(", ");
  };

  return (
    <>
      <FormControl size="small">
        <Select
          multiple
          sx={{
            backgroundColor: "#fff",
            color: "#2373D3",
            width: "256px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "6px",
            minHeight: "36px",
            fontSize: "14px",
            lineHeight: "22px",
            fontFamily: "Public Sans Variable",
            padding: "0 12px",
            fontWeight: 400,
            gap: "6px",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#2373D3",
              borderWidth: "1px",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#2373D3",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#2373D3",
              borderWidth: "1px",
            },
            "& .MuiSelect-select": {
              padding: "8px 0",
            },
            "&:disabled": {
              opacity: 0.4,
            },
          }}
          IconComponent={(props) => (
            <Iconify
              icon="iconamoon:arrow-down-2-thin"
              width="16px"
              height="16px"
              style={{
                color: "#2373D3",
              }}
              {...props}
            />
          )}
          value={value.map((choice) => choice.page_id)}
          onChange={handleChange}
          renderValue={renderValue}
          displayEmpty
        >
          {pages.map((page) => (
            <MenuItem key={page.id} value={page.page_id}>
              <Checkbox
                checked={value.some(
                  (choice) => choice.page_id === page.page_id
                )}
                sx={{
                  color: "#2373D3",
                  "&.Mui-checked": {
                    color: "#2373D3",
                  },
                }}
              />
              <ListItemText primary={page.page_name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default DropdownPageChoice;
