import { Iconify } from "@/components/iconify";
import { FormControl, Select, MenuItem } from "@mui/material";
import React from "react";

interface CustomCalendarStatusChoicesProps {
  value: string;
  onChange: (value: string) => void;
}

const CustomCalendarStatusChoices: React.FC<
  CustomCalendarStatusChoicesProps
> = ({ value, onChange }) => {
  return (
    <>
      <FormControl size="small">
        <Select
          sx={{
            backgroundColor: "#F2F7FD",
            height: "36px",
            fontFamily: "Inter",
            fontSize: "14px",
            lineHeight: "22px",
            fontWeight: 400,
            color: "#2373D3",
            border: 0,
            borderRadius: "6px",
            gap: "6px",
            "&:hover": {
              backgroundColor: "#D7E6F8",
              "&:active": {
                backgroundColor: "#BCD5F4",
              },
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
          value={value}
          onChange={(e) => onChange(e.target.value)}
          renderValue={(e) => {
            return `Trạng thái: ${e}`;
          }}
        >
          <MenuItem value="Tất cả">Tất cả</MenuItem>
          <MenuItem value="Đã lên lịch">Đã lên lịch</MenuItem>
          <MenuItem value="Đã đăng">Đã đăng</MenuItem>
        </Select>
      </FormControl>
    </>
  );
};

export default CustomCalendarStatusChoices;
