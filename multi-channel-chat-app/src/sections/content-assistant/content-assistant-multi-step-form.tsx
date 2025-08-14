"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import * as zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { alpha } from "@mui/material/styles";
import Backdrop from "@mui/material/Backdrop";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";

import { paths } from "@/routes/path";
import { toast } from "@/components/snackbar";
import { Form } from "@/components/hook-form";
import { Content } from "./view/content-assistant-list-view";
import { CONFIG } from "@/config-global";

import {
  ContentStepper,
  StepResearch,
  StepOutline,
  StepContent,
  StepFormatHtml,
} from "./components";
import { createPost } from "@/actions/auto-mia";
import { POST_STATUS } from "@/constants/auto-post";
import { uploadFile } from "@/actions/upload";

// ----------------------------------------------------------------------

const ContentSchema = zod.object({
  // Step 1: Research & Analysis
  topic: zod.string().min(1, { message: "Chủ đề là bắt buộc!" }),
  post_type: zod.string().min(1, { message: "Loại bài viết là bắt buộc!" }),
  main_seo_keyword: zod
    .string()
    .min(1, { message: "Từ khoá SEO chính là bắt buộc!" }),
  secondary_seo_keywords: zod.string().array().default([]),
  customer_group: zod.number().array().min(1, "Nhóm khách hàng là bắt buộc"),
  customer_journey: zod
    .number()
    .array()
    .min(1, { message: "Hành trình khách hàng là bắt buộc!" }),
  additional_notes: zod.string().default(""),
  ai_rule_based: zod.number().array().default([]),
  content_tone: zod.number().array().default([]),
  additional_notes_step_1: zod.string().default(""),
  omni_channels: zod
    .number()
    .array()
    .min(1, { message: "Omni channel là bắt buộc" }),

  // Step 2: Outline
  outline_post: zod.string().min(1, { message: "Dàn ý không được để trống" }),
  post_goal: zod.string().min(1, { message: "Mục tiêu không được để trống" }),
  post_notes: zod.string().default(""),
  additional_notes_step_2: zod.string().default(""),

  // Step 3: Content
  post_content: zod.string().default(""),
  additional_notes_step_3: zod.string().default(""),
  ai_notes_create_image_step_3: zod.string().default(""),
  media: zod.instanceof(File).array().default([]),
  media_generated_ai: zod
    .array(
      zod.object({
        id: zod.number(),
        ai_content_suggestions_id: zod.number(),
        directus_files_id: zod.string(),
      })
    )
    .default([]),

  // Step 4: Format
  additional_notes_step_4: zod.string().default(""),
  post_html_format: zod.string().default(""),

  // fields not in form
  status: zod.string().default(POST_STATUS.DRAFT),
  id: zod.number().nullable().default(null),
});

type FormData = zod.infer<typeof ContentSchema>;

// ----------------------------------------------------------------------

// Helper function to upload files
const uploadFiles = async (
  files: File[]
): Promise<Array<{ id: string; url: string }>> => {
  if (!files || files.length === 0) {
    return [];
  }

  const uploadPromises = files.map(async (file: File) => {
    const uploadResponse = await uploadFile(file);
    return {
      id: uploadResponse.data.id,
      url: `${CONFIG.serverUrl}/admin/files/${uploadResponse.data.id}`,
    };
  });

  return await Promise.all(uploadPromises);
};

type Props = {
  currentContent?: Content;
};

export function ContentAssistantMultiStepForm({ currentContent }: Props) {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [cachedStep1Data, setCachedStep1Data] =
    useState<Partial<FormData> | null>(null);
  const [cachedStep2Data, setCachedStep2Data] =
    useState<Partial<FormData> | null>(null);

  const defaultValues: Partial<FormData> = useMemo(
    () => ({
      // Step 1
      topic: currentContent?.topic || "Chăm sóc trí óc",
      post_type: currentContent?.post_type || "social_post",
      main_seo_keyword: currentContent?.main_seo_keyword || "chăm",
      secondary_seo_keywords: currentContent?.secondary_seo_keywords || [],
      customer_group: Array.isArray(currentContent?.customer_group)
        ? currentContent.customer_group
            .map((item) =>
              typeof item === "object" && "id" in item ? item.id : item
            )
            .filter((id): id is number => typeof id === "number")
        : [],
      customer_journey: Array.isArray(currentContent?.customer_journey)
        ? currentContent.customer_journey
            .map((item) =>
              typeof item === "object" && "id" in item ? item.id : item
            )
            .filter((id): id is number => typeof id === "number")
        : [],
      content_tone: Array.isArray(currentContent?.content_tone)
        ? currentContent.content_tone
            .map((item) =>
              typeof item === "object" && "id" in item ? item.id : item
            )
            .filter((id): id is number => typeof id === "number")
        : [],
      ai_rule_based: Array.isArray(currentContent?.ai_rule_based)
        ? currentContent.ai_rule_based
            .map((item) =>
              typeof item === "object" && "id" in item ? item.id : item
            )
            .filter((id): id is number => typeof id === "number")
        : [],
      additional_notes_step_1: currentContent?.additional_notes_step_1 || "",
      status:
        (currentContent?.status as string) || (POST_STATUS.DRAFT as string),
      id: typeof currentContent?.id === "number" ? currentContent.id : null,
      omni_channels: Array.isArray(currentContent?.omni_channels)
        ? currentContent.omni_channels
            .map((item) =>
              typeof item === "object" && "id" in item ? item.id : item
            )
            .filter((id): id is number => typeof id === "number")
        : [],

      // Step 2
      outline_post: currentContent?.outline_post || "",
      post_goal: currentContent?.post_goal || "",
      post_notes: currentContent?.post_notes || "",
      additional_notes_step_2: currentContent?.additional_notes_step_2 || "",

      // Step 3
      post_content:
        typeof currentContent?.post_content === "string"
          ? currentContent.post_content
          : "",
      additional_notes_step_3: currentContent?.additional_notes_step_3 || "",
      ai_notes_create_image_step_3:
        currentContent?.ai_notes_create_image_step_3 || "",
      media: currentContent?.media || [],
      media_generated_ai: currentContent?.media_generated_ai || [],

      // Step 4
      additional_notes_step_4: currentContent?.additional_notes_step_4 || "",
      post_html_format: currentContent?.post_html_format || "",
    }),
    [currentContent]
  );

  const methods = useForm<FormData>({
    resolver: zodResolver(ContentSchema),
    defaultValues,
    mode: "onChange",
  });

  const {
    reset,
    handleSubmit,
    trigger,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentContent) {
      reset(defaultValues);
      // Reset cache when content changes
      setCachedStep1Data(null);
      setCachedStep2Data(null);
    }
  }, [currentContent, defaultValues, reset]);

  const buildStep1Data = (formData: FormData) => ({
    topic: formData.topic,
    post_type: formData.post_type,
    main_seo_keyword: formData.main_seo_keyword,
    secondary_seo_keywords: formData.secondary_seo_keywords || [],
    customer_group:
      formData.customer_group?.map((item) => ({
        customer_group_id: item,
      })) || [],
    customer_journey:
      formData.customer_journey?.map((item) => ({
        customer_journey_id: item,
      })) || [],
    ai_rule_based:
      formData.ai_rule_based?.map((item) => ({
        ai_rule_based_id: item,
      })) || [],
    content_tone:
      formData.content_tone?.map((item) => ({
        content_tone_id: item,
      })) || [],
    additional_notes_step_1: formData.additional_notes_step_1,
    status: formData.status || POST_STATUS.DRAFT,
    omni_channels: formData.omni_channels?.map((item) => ({
      omni_channels_id: item,
    })),
  });

  const getStep1FormData = (formData: FormData) => ({
    topic: formData.topic,
    post_type: formData.post_type,
    main_seo_keyword: formData.main_seo_keyword,
    secondary_seo_keywords: formData.secondary_seo_keywords,
    customer_group: formData.customer_group,
    customer_journey: formData.customer_journey,
    ai_rule_based: formData.ai_rule_based,
    content_tone: formData.content_tone,
    additional_notes_step_1: formData.additional_notes_step_1,
    omni_channels: formData.omni_channels,
  });

  const getStep2FormData = (formData: FormData) => ({
    outline_post: formData.outline_post,
    post_goal: formData.post_goal,
    post_notes: formData.post_notes,
    additional_notes_step_2: formData.additional_notes_step_2,
    omni_channels: formData.omni_channels,
  });

  const isStep1DataChanged = (
    currentData: Partial<FormData>,
    cachedData: Partial<FormData> | null
  ) => {
    if (!cachedData) return true;

    return JSON.stringify(currentData) !== JSON.stringify(cachedData);
  };

  const isStep2DataChanged = (
    currentData: Partial<FormData>,
    cachedData: Partial<FormData> | null
  ) => {
    if (!cachedData) return true;

    return JSON.stringify(currentData) !== JSON.stringify(cachedData);
  };

  const handleNext = async () => {
    const fieldsToValidate = getFieldsForStep(activeStep);
    const isStepValid = await trigger(fieldsToValidate);

    if (!isStepValid) return;
    let imageUrls: string[] = [];

    switch (activeStep) {
      case 0:
        // Call API for step 1 - step research
        const formData = methods.getValues();
        const currentStep1Data = getStep1FormData(formData);

        // Check if step 1 data has changed
        if (!isStep1DataChanged(currentStep1Data, cachedStep1Data)) {
          // Data hasn't changed, skip API call
          setActiveStep((prevStep) => Math.min(prevStep + 1, 3));
          break;
        }

        setIsNextLoading(true);
        try {
          const apiData = {
            step1: buildStep1Data(formData),
            step2: {},
            step3: {},
            step4: {},
            id: currentContent?.id || null,
          };

          const response = await createPost(apiData);
          if (response?.data) {
            methods.setValue(
              "outline_post",
              response?.data?.outline_post || ""
            );
            methods.setValue("post_goal", response?.data?.post_goal || "");
            methods.setValue("id", response?.data?.id);
          }

          // Cache the step 1 data after successful API call
          setCachedStep1Data(currentStep1Data);

          setActiveStep((prevStep) => Math.min(prevStep + 1, 3));
        } catch (error) {
          console.error("Error calling API:", error);
          toast.error("Có lỗi xảy ra khi tạo dàn ý!");
        } finally {
          setIsNextLoading(false);
        }
        break;

      case 1:
        // Call API for step 2 - step outline
        const formDataStep2 = methods.getValues();
        const currentStep2Data = getStep2FormData(formDataStep2);

        // Check if step 2 data has changed
        if (!isStep2DataChanged(currentStep2Data, cachedStep2Data)) {
          // Data hasn't changed, skip API call
          setActiveStep((prevStep) => Math.min(prevStep + 1, 3));
          break;
        }

        setIsNextLoading(true);
        try {
          const apiData = {
            id: currentContent?.id || formDataStep2.id || null,
            step1: {},
            step2: {
              outline_post: formDataStep2.outline_post,
              post_goal: formDataStep2.post_goal,
              post_notes: formDataStep2.post_notes,
              additional_notes_step_2: formDataStep2.additional_notes_step_2,
              omni_channels: formDataStep2.omni_channels?.map((item) => ({
                omni_channels_id: item,
              })),
            },
            step3: {},
            step4: {},
          };

          const response = await createPost(apiData);
          if (response?.data?.post_content) {
            methods.setValue("post_content", response.data.post_content);
          }

          // Cache the step 2 data after successful API call
          setCachedStep2Data(currentStep2Data);

          setActiveStep((prevStep) => Math.min(prevStep + 1, 3));
        } catch (error) {
          console.error("Error calling API:", error);
          toast.error("Có lỗi xảy ra khi tạo nội dung!");
        } finally {
          setIsNextLoading(false);
        }
        break;

      case 2:
        // Call API for step 3 - step content
        setIsNextLoading(true);
        try {
          const formData = methods.getValues();
          // Upload media files if they exist
          const mediaArray = await uploadFiles(formData.media || []);
          imageUrls = [
            ...formData.media_generated_ai?.map(
              (item) => item.directus_files_id
            ),
            ...mediaArray?.map((item) => item.id),
          ];
          const apiData = {
            id: currentContent?.id || formData.id || null,
            step1: {},
            step2: {},
            step3: {},
            step4: {
              post_content: formData.post_content,
              image_urls: imageUrls?.map(
                (item) => `${CONFIG.serverUrl}/assets/${item}`
              ),
            },
          };

          const response = await createPost(apiData);
          if (response?.data?.post_html_format) {
            methods.setValue(
              "post_html_format",
              response.data.post_html_format
            );
          }

          setActiveStep((prevStep) => Math.min(prevStep + 1, 3));
        } catch (error) {
          console.error("Error calling API:", error);
          toast.error("Có lỗi xảy ra khi tạo HTML format!");
        } finally {
          setIsNextLoading(false);
        }
        break;
      case 3:
        // Call API for step 4 - step format html
        setIsNextLoading(true);
        try {
          const formData = methods.getValues();
          const apiData = {
            id: currentContent?.id || formData.id || null,
            step1: {},
            step2: {},
            step3: {},
            step4: {
              post_content: formData.post_content,
              post_html_format: formData.post_html_format,
              additional_notes_step_4: formData.additional_notes_step_4,
            },
          };

          await createPost(apiData);
          // set success
        } catch (error) {
          console.error("Error calling API:", error);
          toast.error("Có lỗi xảy ra khi tạo HTML format!");
        } finally {
          setIsNextLoading(false);
        }
      default:
        setActiveStep((prevStep) => Math.min(prevStep + 1, 3));
        break;
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const getFieldsForStep = (step: number): (keyof FormData)[] => {
    switch (step) {
      case 0:
        return [
          "topic",
          "post_type",
          "main_seo_keyword",
          "secondary_seo_keywords",
          "customer_group",
          "customer_journey",
          "omni_channels",
          "ai_rule_based",
          "content_tone",
          "additional_notes_step_1",
          "status",
          "id",
        ];
      case 1:
        return [
          "outline_post",
          "post_goal",
          "post_notes",
          "additional_notes_step_2",
        ];
      case 2:
        return [
          "post_content",
          "additional_notes_step_3",
          "ai_notes_create_image_step_3",
          "media",
          "media_generated_ai",
        ];
      case 3:
        return ["additional_notes_step_4", "post_html_format"];
      default:
        return [];
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsNextLoading(true);
      const apiData = {
        id: currentContent?.id || data.id || null,
        step1: {},
        step2: {},
        step3: {},
        step4: {},
        isPosted: true,
      };
      await createPost(apiData);

      toast.success("Đăng bài thành công!");

      router.push(paths.dashboard.contentAssistant.root);
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra!");
    } finally {
      setIsNextLoading(false);
    }
  });

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <StepResearch />;
      case 1:
        return <StepOutline />;
      case 2:
        return <StepContent />;
      case 3:
        return <StepFormatHtml />;

      default:
        return <StepResearch />;
    }
  };

  const renderActions = () => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        mt: 4,
        p: 3,
        borderRadius: 1.5,
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
      }}
    >
      {activeStep !== 0 && (
        <Button
          sx={{ borderRadius: 2 }}
          size="large"
          variant="outlined"
          onClick={
            activeStep === 0
              ? () => router.push(paths.dashboard.contentAssistant.root)
              : handleBack
          }
        >
          Quay lại
        </Button>
      )}

      <Stack direction="row" spacing={2}>
        {activeStep < 3 ? (
          <Button
            variant="contained"
            onClick={handleNext}
            size="large"
            sx={{ borderRadius: 2 }}
            loading={isNextLoading}
            disabled={isNextLoading}
          >
            {isNextLoading ? "Đang tạo dàn ý..." : "Tiếp theo"}
          </Button>
        ) : (
          <Button
            type="submit"
            variant="contained"
            loading={isSubmitting}
            size="large"
            sx={{ borderRadius: 2 }}
          >
            {!currentContent ? "Tạo nội dung" : "Cập nhật"}
          </Button>
        )}
      </Stack>
    </Box>
  );

  const getLoadingMessage = () => {
    switch (activeStep) {
      case 0:
        return "Đang phân tích chủ đề và tạo dàn ý...";
      case 1:
        return "Đang tạo nội dung chi tiết...";
      case 2:
        return "Đang xử lý hình ảnh và định dạng HTML...";
      case 3:
        return "Đang hoàn thiện định dạng cuối cùng...";
      default:
        return "Đang xử lý...";
    }
  };

  return (
    <>
      <Form methods={methods} onSubmit={onSubmit}>
        <ContentStepper activeStep={activeStep} />

        {renderStepContent()}

        {renderActions()}
      </Form>

      {/* Loading Overlay */}
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(4px)",
        }}
        open={isNextLoading}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            p: 4,
            borderRadius: 2,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            minWidth: 320,
          }}
        >
          <Box sx={{ textAlign: "center", width: "100%" }}>
            <Typography
              variant="h6"
              sx={{
                color: "#fff",
                fontWeight: 600,
                mb: 1,
              }}
            >
              Đang xử lý...
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                mb: 2,
                lineHeight: 1.5,
              }}
            >
              {getLoadingMessage()}
            </Typography>

            <LinearProgress
              sx={{
                width: "100%",
                height: 6,
                borderRadius: 3,
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#fff",
                  borderRadius: 3,
                },
              }}
            />

            <Typography
              variant="caption"
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
                mt: 2,
                display: "block",
              }}
            >
              Quá trình này có thể mất 1-2 phút. Vui lòng không tắt trình duyệt.
            </Typography>
          </Box>
        </Box>
      </Backdrop>
    </>
  );
}
