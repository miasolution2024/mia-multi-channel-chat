"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { alpha } from "@mui/material";

import { toast } from "@/components/snackbar";
import { Form } from "@/components/hook-form";
import { LoadingOverlay } from "@/components/loading-overlay";

import {
  ContentStepper,
  StepResearch,
  StepOutline,
  StepContent,
  PublishModal,
} from "./components";
import { POST_STEP } from "@/constants/auto-post";
import {
  ContentSchema,
  FormData,
  getFieldsForStep,
  getDefaultValues,
  getSteps,
  buildStepResearchData,
  buildStepOutlineData,
  buildStepWriteArticleData,
  hasFormDataChanged,
  FileWithApiProperties,
  MediaGeneratedAiItem,
  transformMediaItems,
} from "./utils";
import { CreateContentAssistantRequest } from "./types/content-assistant-create";
import { UpdateContentAssistantRequest } from "./types/content-assistant-update";
import { createPost, PostRequest } from "@/actions/auto-mia";
import { ContentAssistantApiResponse, getContentAssistantList } from "@/actions/content-assistant";
  import { useRouter } from "next/navigation";
import { Content } from "./view/content-assistant-list-view";
import { useCreateContentAssistant } from "@/hooks/apis/use-create-content-assistant";
import { useUpdateContentAssistant } from "@/hooks/apis/use-update-content-assistant";
import { useGetContentAssistantById } from "@/hooks/apis/use-get-content-assistant-by-id";


// ----------------------------------------------------------------------

interface ContentAssistantMultiStepFormProps {
  editData?: Content | ContentAssistantApiResponse | null;
}

export function ContentAssistantMultiStepForm({
  editData,
}: ContentAssistantMultiStepFormProps) {

  const [aiImagesToCheckDelete, setAiImagesToCheckDelete] = useState<MediaGeneratedAiItem[]>([]);

  const router = useRouter();

  const getInitStep = (initStep: string | undefined) => {
    if (!initStep) return POST_STEP.RESEARCH_ANALYSIS;
    if ([POST_STEP.GENERATE_IMAGE, POST_STEP.WRITE_ARTICLE].includes(initStep))
      return POST_STEP.WRITE_ARTICLE;
    if (
      [POST_STEP.RESEARCH_ANALYSIS, POST_STEP.MAKE_OUTLINE].includes(initStep)
    )
      return initStep;
  };
  const [activeStep, setActiveStep] = useState(
    editData ? getInitStep(editData?.current_step) : POST_STEP.RESEARCH_ANALYSIS
  );
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [hasDataChanged, setHasDataChanged] = useState(false);
  const { createContentAssistant, isLoading: isCreating } =
    useCreateContentAssistant();
  const { updateContentAssistant, isLoading: isUpdating } =
    useUpdateContentAssistant();
  const { getContentAssistant } = useGetContentAssistantById();


  const isProcessing = isCreating || isUpdating || isNextLoading;
  const initialDataRef = useRef<FormData | null>(null);

  const defaultValues = getDefaultValues(editData);

  const methods = useForm<FormData>({
    resolver: zodResolver(ContentSchema),
    defaultValues,
    mode: "onChange",
    shouldFocusError: true,
  });

  // Store initial data when form is loaded with existing data
  useEffect(() => {
    const currentData = methods.getValues();
    if (currentData.id && !initialDataRef.current) {
      initialDataRef.current = { ...currentData };
    }
  }, [methods]);

  // Watch for form changes to enable/disable save draft
  useEffect(() => {
    const subscription = methods.watch((data) => {
      if (data?.id && initialDataRef.current) {
        // Use the same logic as handleStepProcess to detect changes
        const hasChanged = hasFormDataChanged(
          data as FormData,
          initialDataRef.current,
          activeStep
        );
        setHasDataChanged(hasChanged);
      } else if (!data?.id) {
        // For new records (no id), check if any required fields have content
        const hasContent = !!(data?.topic?.trim() || data?.post_type || data?.main_seo_keyword?.trim());
        setHasDataChanged(hasContent);
      } else {
        setHasDataChanged(false);
      }
    });
    return () => subscription.unsubscribe();
  }, [methods, activeStep]);

  const { handleSubmit } = methods;

  const handleSubmitPost = async () => {
    try {
      // Handle final form submission
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra!");
      throw error;
    }
  };

  const onSubmit = handleSubmit(handleSubmitPost);

  const getLoadingMessage = () => {
    const isUpdate = !!methods.getValues().id;

    if (activeStep === POST_STEP.RESEARCH_ANALYSIS) {
      if (isUpdate) {
        return "Đang cập nhật và tạo dàn ý...";
      }
      return "Đang tạo mới và tạo dàn ý...";
    } else if (activeStep === POST_STEP.MAKE_OUTLINE) {
      return "Đang cập nhật và tạo nội dung...";
    }

    return "Đang xử lý...";
  };

  const handleStepProcess = useCallback(
    async (data: FormData, currentStep: string) => {
      setIsNextLoading(true);
      try {
        const isUpdate = !!data?.id;
        let response;
        let shouldCallN8N = true;
        let nextStep: string;
        let n8nStartStep: number;
        let n8nEndStep: number;

        // Determine step-specific configurations
        if (currentStep === POST_STEP.RESEARCH_ANALYSIS) {
          nextStep = POST_STEP.MAKE_OUTLINE;
          n8nStartStep = 1;
          n8nEndStep = 2;
        } else if (currentStep === POST_STEP.MAKE_OUTLINE) {
          nextStep = POST_STEP.WRITE_ARTICLE;
          n8nStartStep = 2;
          n8nEndStep = 3;
        } else {
          return;
        }

        if (isUpdate) {
          // Check if data has changed before calling update API
          if (!hasFormDataChanged(data, initialDataRef.current, currentStep)) {
            // Data hasn't changed, skip API call but still proceed to next step
            shouldCallN8N = false;
            setActiveStep(nextStep);
            return;
          }

          // Update existing content assistant with step-specific data
          let updateData;
          if (currentStep === POST_STEP.RESEARCH_ANALYSIS) {
            updateData = await buildStepResearchData(
              data,
              false
            ) as UpdateContentAssistantRequest;
          } else {
            updateData = buildStepOutlineData(
              data
            ) as UpdateContentAssistantRequest;
          }
          response = await updateContentAssistant(data.id!, updateData);

          // Update initial data reference after successful update
          if (response?.data?.id) {
            initialDataRef.current = { ...data };
          }
        } else {
          // Create new content assistant (only for RESEARCH_ANALYSIS step)
          if (currentStep === POST_STEP.RESEARCH_ANALYSIS) {
            const createData = await buildStepResearchData(
              data,
              true
            ) as CreateContentAssistantRequest;
            response = await createContentAssistant(createData);

            if (response?.data?.id) {
              methods.setValue("id", response.data.id);
              // Set initial data reference for new record
              const updatedData = { ...data, id: response.data.id };
              initialDataRef.current = updatedData;
            }
          } else {
            toast.error("Không thể tạo mới ở step này");
            return;
          }
        }

        if (!response?.data?.id) {
          toast.error(
            "Có lỗi xảy ra khi " +
              (isUpdate ? "cập nhật" : "tạo") +
              " content assistant"
          );
          return;
        }

        // Call n8n flow only if we made changes
        if (shouldCallN8N) {
          const inputN8NData: PostRequest = [
            {
              id: response.data.id,
              startStep: n8nStartStep,
              endStep: n8nEndStep,
            },
          ];

          const n8nResponse = await createPost(inputN8NData);

          if (!n8nResponse?.success) {
            const errorMessage =
              currentStep === POST_STEP.RESEARCH_ANALYSIS
                ? "Có lỗi xảy ra khi tạo dàn ý"
                : "Có lỗi xảy ra khi tạo nội dung";
            toast.error(n8nResponse?.message || errorMessage);
            return;
          }

          // Get latest data after N8N processing
          const detailResponse = await getContentAssistant(response.data.id);

          if (detailResponse) {
            if (currentStep === POST_STEP.RESEARCH_ANALYSIS) {
              methods.setValue(
                "outline_post",
                detailResponse.outline_post || ""
              );
              methods.setValue("post_goal", detailResponse.post_goal || "");
            } else if (currentStep === POST_STEP.MAKE_OUTLINE) {
              methods.setValue(
                "post_content",
                detailResponse.post_content || ""
              );
            }
          }
        }

        // Update initialDataRef only when successfully moving to next step
        initialDataRef.current = { ...data };
        setActiveStep(nextStep);
      } catch (error) {
        console.error("Error in handleStepProcess:", error);
        toast.error("Có lỗi xảy ra trong quá trình xử lý");
      } finally {
        setIsNextLoading(false);
      }
    },
    [
      updateContentAssistant,
      createContentAssistant,
      methods,
      getContentAssistant,
    ]
  );

  const handleNext = useCallback(async () => {
    if (!activeStep) return;  
    const fieldsToValidate = getFieldsForStep(activeStep);
    const isStepValid = await methods.trigger(fieldsToValidate);
    if (!isStepValid) {
      return;
    }

    const formData = methods.getValues();

    switch (activeStep) {
      case POST_STEP.RESEARCH_ANALYSIS:
        await handleStepProcess(formData, POST_STEP.RESEARCH_ANALYSIS);
        return;
      case POST_STEP.MAKE_OUTLINE:
        await handleStepProcess(formData, POST_STEP.MAKE_OUTLINE);
        return;
      case POST_STEP.WRITE_ARTICLE:
        setShowPublishModal(true);
        break;
      default:
        break;
    }
  }, [activeStep, methods, handleStepProcess]);

  const handleSaveDraft = useCallback(
    async ({hideToast = false} : {hideToast?: boolean}) => {
      try {
        setIsNextLoading(true);
        const formData = methods.getValues();
        const stepToSave = activeStep;
        const isUpdate = !!formData?.id;
        let response;

        if (!isUpdate) {
          // Create new content assistant if no ID exists
          if (stepToSave !== POST_STEP.RESEARCH_ANALYSIS) {
            return;
          }
          
          // Validate form before saving draft for new records
          const fieldsToValidate = getFieldsForStep(stepToSave);
          const isStepValid = await methods.trigger(fieldsToValidate);
          if (!isStepValid) {
            toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
            return;
          }
          
          const createData = await buildStepResearchData(
            formData,
            true
          ) as CreateContentAssistantRequest;
          response = await createContentAssistant(createData);

          if (response?.data?.id) {
            methods.setValue("id", response.data.id);
            // Set initial data reference for new record
            const updatedData = { ...formData, id: response.data.id };
            initialDataRef.current = updatedData;
          } else {
            toast.error("Có lỗi xảy ra khi tạo content assistant");
            return;
          }
        }

        let stepData;

        // Build data based on current step
        switch (stepToSave) {
          case POST_STEP.RESEARCH_ANALYSIS:
            stepData = await buildStepResearchData(
              formData,
              false
            ) as UpdateContentAssistantRequest;
            break;
          case POST_STEP.MAKE_OUTLINE:
            stepData = buildStepOutlineData(
              formData
            ) as UpdateContentAssistantRequest;
            break;
          case POST_STEP.WRITE_ARTICLE:
            const dataMediaEdit = {
              media: (editData?.media as FileWithApiProperties[]) || [],
              media_generated_ai:
                (editData?.media_generated_ai as MediaGeneratedAiItem[]) || aiImagesToCheckDelete,
              id: editData?.id?.toString(),
            };
            stepData = (await buildStepWriteArticleData(
              formData,
              dataMediaEdit,
            )) as UpdateContentAssistantRequest;
            break;
          default:
            toast.error("Step không hợp lệ để lưu nháp");
            return;
        }

        const contentId = isUpdate ? formData.id! : response!.data!.id;
        await updateContentAssistant(contentId, stepData);

        // Refresh data from server after successful save to update media field
        try {
          const refreshedData = await getContentAssistantList(
        {
          id: Number(contentId),
        }
      );
          if (refreshedData.data[0]) {
            // Use getDefaultValues to properly transform the data
            const newImageData = transformMediaItems(refreshedData.data[0].media as unknown as MediaGeneratedAiItem[]);
            if (newImageData) {
              methods.setValue('media', newImageData);
            }
          }
        } catch (error) {
          console.error("Error refreshing data after save:", error);
        }

        // Reset hasDataChanged state since data is now saved
        setHasDataChanged(false);

        setShowPublishModal(false);
        if(!hideToast){
          toast.success("Đã lưu bản nháp thành công!");
        }
      } catch (error) {
        console.error("Error saving draft:", error);
        toast.error("Có lỗi xảy ra khi lưu bản nháp");
      } finally {
        setIsNextLoading(false);
      }
    },
    [methods, editData, updateContentAssistant, activeStep, createContentAssistant, aiImagesToCheckDelete]
  );

  const handlePublish = async () => {
    try {
      setIsNextLoading(true);
      const formData = methods.getValues();

      if (!formData?.id) {
        toast.error("Không thể đăng bài khi chưa có ID");
        return;
      }

      // Save current step data first
      const dataMediaEdit = {
        media: (editData?.media as FileWithApiProperties[]) || [],
        media_generated_ai:
          (editData?.media_generated_ai as MediaGeneratedAiItem[]) || [],
        id: editData?.id?.toString(),
      };
      const stepData = await buildStepWriteArticleData(formData, dataMediaEdit);
      const response = await updateContentAssistant(formData.id, stepData);

      if (response?.data?.id) {
        const inputN8NData: PostRequest = [
          {
            id: response.data.id,
            startStep: 4,
            endStep: 6,
          },
        ];

        const responseN8N = await createPost(inputN8NData);

        // update current_step thành done
        if (responseN8N?.success) {
          await updateContentAssistant(formData.id, {
            current_step: POST_STEP.PUBLISHED,
          });
          toast.success("Đã đăng bài thành công!");
          router.push(`/dashboard/content-assistant`);
        }
      }

      setShowPublishModal(false);
    } catch (error) {
      console.error("Error publishing:", error);
      toast.error("Có lỗi xảy ra khi đăng bài");
    } finally {
      setIsNextLoading(false);
    }
  };

  const renderStepContent = () => {
    const formData = methods.getValues();
    const contentAssistantId = formData.id?.toString();

    switch (activeStep) {
      case POST_STEP.RESEARCH_ANALYSIS:
        return <StepResearch />;
      case POST_STEP.MAKE_OUTLINE:
        return <StepOutline />;
      case POST_STEP.WRITE_ARTICLE:
        return <StepContent setAiImagesToCheckDelete={setAiImagesToCheckDelete} contentAssistantId={contentAssistantId} hasDataChanged={hasDataChanged} />;
      default:
        return null;
    }
  };

  const handleBack = () => {
    if (!activeStep) return;
    const steps = getSteps();
    const currentIndex = steps.indexOf(activeStep);
    if (currentIndex > 0) {
      setActiveStep(steps[currentIndex - 1]);
    }
  };

  const isLastStep = activeStep === POST_STEP.WRITE_ARTICLE;
  const isFirstStep = activeStep === POST_STEP.RESEARCH_ANALYSIS;

  if (!activeStep) return null;

  return (
    <>
      <LoadingOverlay
        open={isNextLoading}
        title="Đang xử lý..."
        description={getLoadingMessage()}
      />
      <Form methods={methods} onSubmit={onSubmit}>
        <Stack>
          <ContentStepper currentStep={activeStep} />

          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
              border: (theme) => `dashed 1px ${theme.palette.divider}`,
            }}
          >
            {renderStepContent()}
          </Box>

          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ 
              position: 'sticky',
              bottom: 0,
              backgroundColor: 'background.paper',
              py: 2,
              mb: 2,
              zIndex: 1000,
            }}
          >
            <Button
              size="large"
              variant="outlined"
              onClick={handleBack}
              disabled={isFirstStep}
              sx={{ minWidth: 150, borderRadius: 2 }}
            >
              Quay lại
            </Button>

            {/* Show Save Draft button when data has changed */}
            {hasDataChanged && (
              <Button
                size="large"
                variant="outlined"
                onClick={() => handleSaveDraft({})}
                disabled={isProcessing}
                sx={{ minWidth: 150, borderRadius: 2 }}
              >
                {isProcessing ? "Đang lưu..." : "Lưu nháp"}
              </Button>
            )}

            <Button
              size="large"
              variant="contained"
              onClick={handleNext}
              disabled={isProcessing}
              sx={{ minWidth: 150, borderRadius: 2 }}
            >
              {isProcessing
                ? "Đang xử lý..."
                : isLastStep
                ? "Hoàn thành"
                : "Tiếp theo"}
            </Button>
          </Stack>
        </Stack>
      </Form>

      <PublishModal
        open={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onSaveDraft={ async () => {
          await handleSaveDraft({hideToast: true});
        }}
        onPublish={handlePublish}
        isSavingDraft={isNextLoading}
        isPublishing={isNextLoading}
      />
    </>
  );
}
