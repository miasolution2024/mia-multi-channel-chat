import { Iconify } from "@/components/iconify";
import { FormControl, Select, MenuItem } from "@mui/material";
import React from "react";

interface CustomCalendarTimeChoiceProps {
  value: string;
  onChange: (value: string) => void;
}

const CustomCalendarTimeChoice: React.FC<CustomCalendarTimeChoiceProps> = ({
  value,
  onChange,
}) => {
  return (
    <>
      <FormControl size="small">
        <Select
          sx={{
            backgroundColor: "#2373d3",
            color: "#fff",
            borderRadius: "6px",
            height: "36px",
            fontSize: "14px",
            lineHeight: "22px",
            fontWeight: 400,
            border: "none",
            gap: "6px",
            fontFamily: "Inter",
            "&:hover": {
              backgroundColor: "#1C5CAA",
              "&:active": {
                backgroundColor: "#154681",
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
                color: "#fff",
              }}
              {...props}
            />
          )}
          value={value}
          onChange={(e) => onChange(e.target.value as string)}
        >
          <MenuItem value="Ngày">Ngày</MenuItem>
          <MenuItem value="Tuần">Tuần</MenuItem>
          <MenuItem value="Tháng">Tháng</MenuItem>
        </Select>
      </FormControl>
    </>
  );
};

export default CustomCalendarTimeChoice;
