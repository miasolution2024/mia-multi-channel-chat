import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import CustomCalendar from "@/components/custom-calendar/custom-calendar";
import { Iconify } from "@/components/iconify";
import { DashboardContent } from "@/layouts/dashboard";
import { paths } from "@/routes/path";
import { Box, Button, FormControl, MenuItem, Select } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

export function ScheduleCalendarView() {
  const router = useRouter();
  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Lên lịch đăng bài"
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            {
              name: "Lên lịch đăng bài",
              href: paths.dashboard.postCalendar.root,
            },
          ]}
          action={
            <Box
              style={{
                gap: 5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                sx={{
                  height: 36,
                  width: 124,
                  fontWeight: "normal",
                  fontSize: "14px",
                  borderRadius: "6px",
                  backgroundColor: "#2373D3",
                  color: "#fff",
                  p: "0 12px",
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
                onClick={() =>
                  router.push(paths.dashboard.contentAssistant.new)
                }
                startIcon={
                  <Iconify icon="ep:document" width="16px" height="16px" />
                }
              >
                Tạo bài viết
              </Button>

              <FormControl
                size="small"
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "6px",
                  color: "#fff",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "6px",
                    backgroundColor: "#DAECFA",
                    height: 36,
                    width: 36,
                    minWidth: 36,
                  },
                  "&:hover": {
                    backgroundColor: "#DAECFA",
                    "&:active": {
                      backgroundColor: "#DAECFA",
                    },
                  },
                  "&:disabled": {
                    opacity: 0.4,
                  },
                }}
              >
                <Select
                  MenuProps={{
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "right",
                    },
                    transformOrigin: {
                      vertical: "top",
                      horizontal: "right",
                    },
                  }}
                  IconComponent={(props) => (
                    <Iconify
                      icon="ri:arrow-down-s-fill"
                      width="16px"
                      height="16px"
                      style={{
                        color: "#2373D3",
                        position: "absolute",
                        right: 9,
                        top: "50%",
                        transform: `translateY(-50%) ${
                          props.className?.includes("MuiSelect-iconOpen")
                            ? "rotate(180deg)"
                            : "rotate(0deg)"
                        }`,
                        transition: "transform 0.3s ease-in-out",
                        pointerEvents: "none",
                      }}
                      {...props}
                    />
                  )}
                  sx={{
                    backgroundColor: "#DAECFA",
                    border: "none",
                  }}
                >
                  <MenuItem>Tạo chiến dịch</MenuItem>
                </Select>
              </FormControl>
            </Box>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <CustomCalendar />
      </DashboardContent>
    </>
  );
}
