"use client";

import { useState } from "react";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import CardHeader from "@mui/material/CardHeader";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import { useFormContext } from "react-hook-form";

import { RHFTextField, RHFEditor, RHFUpload } from "@/components/hook-form";
import { Iconify } from "@/components/iconify";

// ----------------------------------------------------------------------

export function StepContent() {
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  const [isImageNotesExpanded, setIsImageNotesExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<File[]>([]);

  const { setValue, watch } = useFormContext();
  const mediaGeneratedAi = watch("media_generated_ai") || [];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleGenerateImage = async () => {
    setIsGenerating(true);

    // Simulate API call delay
    setTimeout(async () => {
      // Use Unsplash images as fake generated images
      const fakeImageUrls = [
        "https://images.unsplash.com/photo-1754764987594-2236e7736115?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1754766621748-2a96cbf56a1f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ];

      const fakeFiles = await Promise.all(
        fakeImageUrls.map(async (url, index) => {
          const response = await fetch(url);
          const blob = await response.blob();
          return new File([blob], `generated-image-${index + 1}.jpg`, {
            type: "image/jpeg",
          });
        })
      );

      setGeneratedImages(fakeFiles);

      // Save to form field
      const updatedMedia = [...mediaGeneratedAi, ...fakeFiles];
      setValue("media_generated_ai", updatedMedia);

      setIsGenerating(false);
    }, 2000);
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = generatedImages.filter((_, i) => i !== index);
    setGeneratedImages(updatedImages);

    const updatedMedia = mediaGeneratedAi.filter(
      (file: File) => !generatedImages.includes(file)
    );
    setValue("media_generated_ai", [...updatedMedia, ...updatedImages]);
  };

  return (
    <Box>
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Bài viết" />
        <Tab label="Tệp đính kèm" />
      </Tabs>

      {activeTab === 0 && (
        <Card>
          <Box sx={{ m: 3 }}>
            <RHFTextField
              name="additional_notes_step_3"
              placeholder={
                isNotesExpanded
                  ? "Viết thêm mô tả chi tiết và lưu ý bài viết"
                  : "💬 Nhấp để thêm yêu cầu chi tiết..."
              }
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
          <CardHeader title="Nội dung bài viết" />
          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFEditor
              name="content"
              label="Nội dung bài viết"
              placeholder="Nhập nội dung bài viết"
            />
          </Stack>
        </Card>
      )}

      {activeTab === 1 && (
        <Card>
          <CardHeader title="Tệp đính kèm" />
          <Stack spacing={3} sx={{ p: 3 }}>
            {/* AI Notes for Image Generation */}
            <Box>
              <RHFTextField
                name="ai_notes_create_image_step_3"
                placeholder={"Viết mô tả hình ảnh bạn hướng đến AI đề xuất"}
                multiline={isImageNotesExpanded}
                rows={isImageNotesExpanded ? 4 : 1}
                onClick={() => setIsImageNotesExpanded(true)}
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  if (!e.target.value) {
                    setIsImageNotesExpanded(false);
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
                    alignItems: isImageNotesExpanded ? "flex-start" : "center",
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

            <Divider />

            {/* Image Generation Section */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Tạo sinh hình ảnh tự động
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Tạo sinh hình ảnh ngay dựa trên bài viết đã thực hiện. Bạn có
                thể điều chỉnh prompt ở trên để AI tạo sinh hình ảnh theo mong
                muốn chính xác nhất.
              </Typography>

              <Button
                variant="contained"
                onClick={handleGenerateImage}
                startIcon={
                  isGenerating ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <Iconify icon="solar:gallery-add-bold" />
                  )
                }
                disabled={isGenerating}
                sx={{ mb: 3 }}
              >
                {isGenerating ? "Đang tạo sinh..." : "Tạo sinh hình ảnh"}
              </Button>

              {/* Hiển thị ảnh đã generate */}
              {generatedImages.length > 0 && (
                <Paper sx={{ p: 2, mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Hình ảnh đã tạo sinh ({generatedImages.length})
                  </Typography>
                  <Grid container spacing={2}>
                    {generatedImages.map((file, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Box sx={{ position: "relative" }}>
                          <Box
                            component="img"
                            src={URL.createObjectURL(file)}
                            alt={`Generated ${index + 1}`}
                            sx={{
                              width: "100%",
                              height: 200,
                              objectFit: "cover",
                              borderRadius: 1,
                              border: "1px solid",
                              borderColor: "divider",
                            }}
                          />
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleRemoveImage(index)}
                            sx={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              minWidth: "auto",
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              bgcolor: "rgba(255, 255, 255, 0.9)",
                              "&:hover": {
                                bgcolor: "rgba(255, 255, 255, 1)",
                              },
                            }}
                          >
                            <Iconify
                              icon="solar:trash-bin-minimalistic-bold"
                              width={16}
                            />
                          </Button>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              )}
            </Box>

            <Divider />

            {/* File Upload Section */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Tệp được đính kèm
              </Typography>
              <RHFUpload
                name="media"
                multiple
                accept={{
                  "image/*": [".jpeg", ".jpg", ".png", ".gif"],
                }}
                helperText="Chọn nhiều hình ảnh để đính kèm"
                hidePreview={true}
              />
              
              {/* Hiển thị ảnh đã upload */}
              {watch("media")?.length > 0 && (
                <Paper sx={{ p: 2, mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Hình ảnh đã tải lên ({watch("media").length})
                  </Typography>
                  <Grid container spacing={2}>
                    {watch("media").map((file: File, index: number) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Box sx={{ position: "relative" }}>
                          <Box
                            component="img"
                            src={URL.createObjectURL(file)}
                            alt={`Uploaded ${index + 1}`}
                            sx={{
                              width: "100%",
                              height: 200,
                              objectFit: "cover",
                              borderRadius: 1,
                              border: "1px solid",
                              borderColor: "divider",
                            }}
                          />
                          <Button
                            size="small"
                            color="error"
                            onClick={() => {
                              const currentMedia = watch("media") || [];
                              const updatedMedia = currentMedia.filter((_: File, i: number) => i !== index);
                              setValue("media", updatedMedia);
                            }}
                            sx={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              minWidth: "auto",
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              bgcolor: "rgba(255, 255, 255, 0.9)",
                              "&:hover": {
                                bgcolor: "rgba(255, 255, 255, 1)",
                              },
                            }}
                          >
                            <Iconify
                              icon="solar:trash-bin-minimalistic-bold"
                              width={16}
                            />
                          </Button>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              )}
            </Box>
          </Stack>
        </Card>
      )}
    </Box>
  );
}
