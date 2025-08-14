"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import { Iconify } from "@/components/iconify";
import { RHFTextField } from "@/components/hook-form";
import { HtmlEditor } from "@/components/html-editor";

// ----------------------------------------------------------------------

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export function StepFormatHtml() {
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const { watch } = useFormContext();

  const htmlContent = watch("post_html_format");

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCopyHTML = () => {
    if (htmlContent) {
      navigator.clipboard.writeText(htmlContent);
      console.log("HTML copied to clipboard");
    }
  };

  return (
    <Stack spacing={3}>
      {/* AI Notes Input - Prominent at top */}
      <Box sx={{ mb: 3 }}>
        <RHFTextField
          name="additional_notes_step_4"
          placeholder={"Viết mô tả hình ảnh bạn hướng đến AI đề xuất"}
          multiline={isNotesExpanded}
          rows={isNotesExpanded ? 4 : 1}
          onClick={() => setIsNotesExpanded(true)}
          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
            if (!e.target.value) {
              setIsNotesExpanded(false);
            }
          }}
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
              alignItems: isNotesExpanded ? "flex-start" : "center",
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              },
              "&.Mui-focused": {
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              },
            },
          }}
        />
      </Box>

      {/* HTML Editor and Preview */}
      <Card>
        <CardHeader
          title="Format HTML"
          subheader="Chỉnh sửa và xem trước nội dung HTML"
          action={
            <IconButton onClick={handleCopyHTML} disabled={!htmlContent}>
              <Iconify icon="eva:copy-fill" />
            </IconButton>
          }
        />
        <Divider />

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="HTML editor tabs"
          >
            <Tab label="Chỉnh sửa" {...a11yProps(0)} />
            <Tab label="Xem trước" {...a11yProps(1)} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <HtmlEditor
            name="post_html_format"
            placeholder="Nhập nội dung HTML..."
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box
            sx={{
              minHeight: 400,
              p: 2,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              bgcolor: "background.paper",
            }}
          >
            {htmlContent ? (
              <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            ) : (
              <Typography color="text.secondary" sx={{ fontStyle: "italic" }}>
                Chưa có nội dung để xem trước
              </Typography>
            )}
          </Box>
        </TabPanel>
      </Card>

      {/* Action Buttons */}
      <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
        <Button
          variant="outlined"
          startIcon={<Iconify icon="eva:eye-fill" />}
          onClick={() => setTabValue(1)}
        >
          Xem trước
        </Button>
      </Box>
    </Stack>
  );
}
