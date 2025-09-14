"use client";

import { useState, useEffect } from "react";
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
import { useFormContext } from "react-hook-form";

import { RHFTextField, RHFEditor, RHFUpload } from "@/components/hook-form";
import { Iconify } from "@/components/iconify";
import { LoadingOverlay } from "@/components/loading-overlay";
import { CONFIG } from "@/config-global";
import {
  MediaGeneratedAiItem,
  updateContentAssistant,
  getContentAssistantList,
} from "@/actions/content-assistant";
import { createPost, PostRequest } from "@/actions/auto-mia";
import { buildStepWriteArticleData, FormData } from "../../utils";
import { toast } from "@/components/snackbar";

// ----------------------------------------------------------------------

// Extended File interface to include preview property
interface FileWithPreview extends File {
  preview?: string;
}

interface StepContentProps {
  contentAssistantId?: string;
}

export function StepContent({ contentAssistantId }: StepContentProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const { setValue, watch, getValues } = useFormContext();
  const mediaGeneratedAi = watch("media_generated_ai")

  // Initialize generated images from existing mediaGeneratedAi data
  useEffect(() => {
    if (mediaGeneratedAi && mediaGeneratedAi.length > 0) {
      const imageUrls = mediaGeneratedAi.map(
        (item: MediaGeneratedAiItem | string) => {
          const fileId =
            typeof item === "string" ? item : item.directus_files_id;
          return `${CONFIG.serverUrl}/assets/${fileId}`;
        }
      );
      setGeneratedImages(imageUrls);
    }
  }, [mediaGeneratedAi]);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  const handleGenerateImage = async () => {
    if (!contentAssistantId) {
      toast.error("Content Assistant ID not found");
      return;
    }

    try {
      setIsGenerating(true);

      // Build data for WRITE_ARTICLE step
      const formData = getValues() as FormData;
      const stepData = await buildStepWriteArticleData({
        ...formData, 
        is_generated_by_AI: true,
      });

      // Save current form data to Directus
      const updateResponse = await updateContentAssistant(
        contentAssistantId,
        {...stepData, is_generated_by_AI: true}
      );

      if (!updateResponse) {
        throw new Error("Failed to save data to Directus");
      }

      // Call N8N with specific parameters
      const inputN8NData: PostRequest = [
        {
          id: parseInt(contentAssistantId),
          startStep: 3,
          endStep: 4,
        },
      ];

      const n8nResponse = await createPost(inputN8NData);

      if (!n8nResponse.success) {
        throw new Error("Failed to generate images via N8N");
      }

      // Fetch updated data from Directus to get AI-generated images
      const updatedDataResponse = await getContentAssistantList(
        {
          id: Number(contentAssistantId),
        }
      );
      if (updatedDataResponse.data[0]) {
        // Update form with new AI-generated images
        if (updatedDataResponse.data[0].media_generated_ai) {
          const imageIds = updatedDataResponse.data[0].media_generated_ai?.map(item => item.directus_files_id)
          setValue(
            "media_generated_ai",
            imageIds, 
            {
              shouldDirty: true,
            }
          );
        }
        toast.success("Images generated successfully!");
      } else {
        throw new Error("Failed to fetch updated data from Directus");
      }
    } catch (error) {
      console.error("Error generating images:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to generate images"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const removedImageUrl = generatedImages[index];
    const updatedImages = generatedImages.filter((_, i) => i !== index);
    setGeneratedImages(updatedImages);

    const updatedMedia = mediaGeneratedAi.filter(
      (item: MediaGeneratedAiItem | string) => {
        const fileId = typeof item === "string" ? item : item.directus_files_id;
        const imageUrl = `${CONFIG.serverUrl}/assets/${fileId}&key=system-large-contain`;
        return imageUrl !== removedImageUrl;
      }
    );
    setValue("media_generated_ai", updatedMedia);
  };

  return (
    <Box>
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Bài viết" />
        <Tab label="Tệp đính kèm" />
      </Tabs>

      {activeTab === 0 && (
        <Card>
          <CardHeader title="Nội dung bài viết" />
          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFEditor
              name="post_content"
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
                name="ai_notes_create_image"
                placeholder="Viết mô tả hình ảnh bạn hướng đến AI đề xuất"
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
                startIcon={<Iconify icon="solar:gallery-add-bold" />}
                disabled={isGenerating}
                sx={{ mb: 3 }}
              >
                Tạo sinh hình ảnh
              </Button>

              {/* Hiển thị ảnh đã generate */}
              {generatedImages.length > 0 && (
                <Paper sx={{ p: 2, mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Hình ảnh đã tạo sinh ({generatedImages.length})
                  </Typography>
                  <Grid container spacing={2}>
                    {generatedImages.map((url, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Box sx={{ position: "relative" }}>
                          <Box
                            component="img"
                            src={url}
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
                Hình ảnh được đính kèm
              </Typography>
              <RHFUpload
                name="media"
                multiple
                accept={{
                  "image/*": [".jpeg", ".jpg", ".png"],
                }}
                helperText="Chọn nhiều hình ảnh để đính kèm"
                hidePreview={true}
              />
              {/* Hiển thị ảnh đã upload */}
              {Array.isArray(watch("media")) && watch("media").length > 0 && (
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
                            src={
                              (file as FileWithPreview).preview ||
                              URL.createObjectURL(file)
                            }
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
                              const currentMedia = Array.isArray(watch("media"))
                                ? watch("media")
                                : [];
                              const updatedMedia = currentMedia.filter(
                                (_: File, i: number) => i !== index
                              );
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

            <Divider />

            {/* Video Upload Section */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Video
              </Typography>
              <RHFUpload
                name="video"
                maxFiles={1}
                accept={{
                  "video/*": [".mp4", ".avi", ".mov"],
                }}
                helperText="Chỉ được chọn 1 video. Định dạng hỗ trợ: MP4, AVI, MOV"
                hidePreview
              />

              {/* Video Preview */}
              {Array.isArray(watch("video")) && watch("video").length > 0 && (
                <Paper sx={{ p: 2, mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Video đã chọn
                  </Typography>
                  <Box sx={{ position: "relative", display: "inline-block" }}>
                    <video
                      src={
                        typeof watch("video")[0] === "string"
                          ? `${CONFIG.serverUrl}/assets/${watch("video")[0]}`
                          : watch("video")[0] instanceof File
                          ? (watch("video")[0] as FileWithPreview).preview ||
                            URL.createObjectURL(watch("video")[0])
                          : ""
                      }
                      controls
                      style={{
                        width: "100%",
                        maxWidth: "300px",
                        height: "auto",
                        borderRadius: "8px",
                      }}
                    />
                    <Button
                      size="small"
                      color="error"
                      onClick={() => setValue("video", [])}
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
                      <Iconify icon="mingcute:close-line" width={16} />
                    </Button>
                  </Box>
                </Paper>
              )}
            </Box>
          </Stack>
        </Card>
      )}

      <LoadingOverlay
        open={isGenerating}
        title="Đang tạo sinh hình ảnh..."
        description="AI đang phân tích nội dung và tạo sinh hình ảnh phù hợp"
      />
    </Box>
  );
}
