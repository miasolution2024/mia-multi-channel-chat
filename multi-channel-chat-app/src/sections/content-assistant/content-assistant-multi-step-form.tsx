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

import { paths } from "@/routes/path";
import { toast } from "@/components/snackbar";
import { Form } from "@/components/hook-form";
import { Content } from "./view/content-assistant-list-view";

// Extended Content interface for form data
interface ExtendedContent extends Content {
  main_seo_keyword?: string;
  secondary_seo_keywords?: string[];
  customer_group?: number[];
  customer_journey?: number[];
  content_tone?: number[];
  ai_rule_based?: number[];
  additional_notes?: string;
  additional_notes_step_1?: string;
  outline_post?: string;
  post_goal?: string;
  post_notes?: string;
  additional_notes_step_2?: string;
  content?: string;
  ai_notes_create_image_step_3?: string;
  media?: File[];
  media_generated_ai?: File[];
  additional_notes_step_4?: string;
  post_html_format?: string;
}
import {
  ContentStepper,
  StepResearch,
  StepOutline,
  StepContent,
  StepFormatHtml,
} from "./components";
import { createPost } from "@/actions/auto-mia";

// ----------------------------------------------------------------------

const ContentSchema = zod.object({
  // Step 1: Research & Analysis
  topic: zod.string().min(1, { message: "Chủ đề là bắt buộc!" }),
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
  media_generated_ai: zod.instanceof(File).array().default([]),

  // Step 4: Format
  additional_notes_step_4: zod.string().default(""),
  post_html_format: zod.string().default(""),
});

type FormData = zod.infer<typeof ContentSchema>;

// ----------------------------------------------------------------------

type Props = {
  currentContent?: ExtendedContent;
};

export function ContentAssistantMultiStepForm({ currentContent }: Props) {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [isNextLoading, setIsNextLoading] = useState(false);

  const defaultValues = useMemo(
    () => ({
      // Step 1
      topic: currentContent?.topic || "",
      main_seo_keyword: currentContent?.main_seo_keyword || "",
      secondary_seo_keywords:
        currentContent?.secondary_seo_keywords || ([] as string[]),
      customer_group: currentContent?.customer_group || ([] as number[]),
      customer_journey: currentContent?.customer_journey || ([] as number[]),
      content_tone: currentContent?.content_tone || ([] as number[]),
      ai_rule_based: currentContent?.ai_rule_based || ([] as number[]),
      additional_notes_step_1: currentContent?.additional_notes_step_1 || "",

      // Step 2
      outline_post: currentContent?.outline_post || "",
      post_goal: currentContent?.post_goal || "",
      post_notes: currentContent?.post_notes || "",
      additional_notes_step_2: currentContent?.additional_notes_step_2 || "",

      // Step 3
      content: currentContent?.content || "",
      ai_notes_create_image_step_3:
        currentContent?.ai_notes_create_image_step_3 || "",
      media: currentContent?.media || ([] as File[]),
      media_generated_ai: currentContent?.media_generated_ai || ([] as File[]),

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

  console.log("erorr", methods.formState.errors);
  const {
    reset,
    handleSubmit,
    trigger,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentContent) {
      reset(defaultValues);
    }
  }, [currentContent, defaultValues, reset]);

  const handleNext = async () => {
    const fieldsToValidate = getFieldsForStep(activeStep);
    const isStepValid = await trigger(fieldsToValidate);

    if (isStepValid) {
      if (activeStep === 0) {
        // Call API after step 1
        setIsNextLoading(true);
        try {
          const formData = methods.getValues();
          const apiData = {
            step1: {
              topic: formData.topic,
              main_seo_keyword: formData.main_seo_keyword,
              secondary_seo_keywords: formData.secondary_seo_keywords,
              customer_group: formData.customer_group,
              customer_journey: formData.customer_journey,
              ai_rule_based: formData.ai_rule_based,
              content_tone: formData.content_tone,
              additional_notes_step_1: formData.additional_notes_step_1,
            },
            step2: {},
            step3: {},
            step4: {},
          };

          const response = await createPost(apiData);

          // Fill outline_post data into form
          if (response.outline_post) {
            console.log("response", response);
            methods.setValue("outline_post", response.outline_post);
          }

          setActiveStep((prevStep) => Math.min(prevStep + 1, 3));
        } catch (error) {
          console.error("Error calling API:", error);
          toast.error("Có lỗi xảy ra khi tạo dàn ý!");
        } finally {
          setIsNextLoading(false);
        }
      } else {
        setActiveStep((prevStep) => Math.min(prevStep + 1, 3));
      }
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
          "main_seo_keyword",
          "secondary_seo_keywords",
          "customer_group",
          "customer_journey",
          "ai_rule_based",
          "content_tone",
          "additional_notes_step_1",
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
      console.log("Form data:", data);

      toast.success(
        currentContent ? "Cập nhật thành công!" : "Tạo mới thành công!"
      );

      router.push(paths.dashboard.contentAssistant.root);
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra!");
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

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <ContentStepper activeStep={activeStep} />

      {renderStepContent()}

      {renderActions()}
    </Form>
  );
}
