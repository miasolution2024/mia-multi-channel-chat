"use client";
import { Iconify } from "@/components/iconify";
import { Box, FormControl, MenuItem, Select } from "@mui/material";
import React from "react";

interface DropdownSourceChoiceProps {
  value: string;
  onChange: (value: string) => void;
}

const DropdownSourceChoice: React.FC<DropdownSourceChoiceProps> = ({
  value,
  onChange,
}) => {
  return (
    <>
      <FormControl size="small">
        <Select
          sx={{
            backgroundColor: "#2373d3",
            width: "149px",
            padding: "0 12px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            borderRadius: "6px",
            height: "36px",
            fontSize: "14px",
            lineHeight: "22px",
            fontFamily: "Public Sans Variable",
            fontWeight: 700,
            boxShadow: "0px 0px 1px #171a1f12, 0px 0px 2px #171a1f1F",
            border: "none",
            gap: "6px",
            "&:hover": {
              backgroundColor: "#1C5CAA",
              "&:active": {
                backgroundColor: "#154681",
              },
            },
            "&:disabled": {
              opacity: 0.4,
            },
            "& .MuiSelect-select": {
              display: "flex",
              alignItems: "center",
              gap: "16px",
              paddingLeft: 0,
            },
          }}
          IconComponent={(props) => (
            <Iconify
              icon="iconamoon:arrow-down-2-thin"
              width="16px"
              height="16px"
              style={{
                color: "#fff",
              }}
              {...props}
            />
          )}
          value={value}
          onChange={(e) => onChange(e.target.value as string)}
          renderValue={(selectedValue) => (
            <>
              <Iconify
                icon="fluent-mdl2:facebook-logo"
                width="16"
                height="16"
                style={{ color: "#fff" }}
              />
              <Box>{selectedValue}</Box>
            </>
          )}
        >
          <MenuItem value="Facebook">
            <Iconify
              icon="logos:facebook"
              width="16"
              height="16"
              style={{ marginRight: "16px" }}
            />
            Facebook
          </MenuItem>
        </Select>
      </FormControl>
    </>
  );
};

export default DropdownSourceChoice;
