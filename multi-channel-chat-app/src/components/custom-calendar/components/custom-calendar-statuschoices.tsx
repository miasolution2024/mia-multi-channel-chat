/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Iconify } from "@/components/iconify";
import { FormControl, Select, MenuItem } from "@mui/material";
import { useGetWorkingScheduleStatus } from "@/actions/post-calendar";
import React, { useEffect, useState } from "react";
import { StatusChoices } from "../type";

interface CustomCalendarStatusChoicesProps {
  value: string;
  onChange: (value: string) => void;
}

const CustomCalendarStatusChoices: React.FC<
  CustomCalendarStatusChoicesProps
> = ({ value, onChange }) => {
  const [statuses, setStatuses] = useState<StatusChoices[]>([
    { id: 0, value: "all", title: "Tất cả" },
  ]);
  const { statusData, isLoading, error } = useGetWorkingScheduleStatus();

  // Mapping function to convert API status to Vietnamese title
  const getStatusTitle = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      draft: "Đang dựng",
      in_progress: "Đã lên lịch",
      published: "Đã đăng",
    };
    return statusMap[status] || status;
  };

  useEffect(() => {
    if (statusData?.data) {
      const apiStatuses: StatusChoices[] = statusData.data.map(
        (item: any, index: number) => ({
          id: index + 1,
          value: item.status,
          title: getStatusTitle(item.status),
        })
      );

      const allStatuses: StatusChoices[] = [
        { id: 0, value: "all", title: "Tất cả" },
        ...apiStatuses,
      ];

      setStatuses(allStatuses);
    }
  }, [statusData]);

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
          renderValue={(selectedValue) => {
            const selectedStatus = statuses.find(
              (status) => status.value === selectedValue
            );
            const displayTitle = selectedStatus
              ? selectedStatus.title
              : selectedValue;
            return `Trạng thái: ${displayTitle}`;
          }}
        >
          {statuses.map((status) => (
            <MenuItem key={status.id} value={status.value}>
              {status.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default CustomCalendarStatusChoices;
