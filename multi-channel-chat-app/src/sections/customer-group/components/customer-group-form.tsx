"use client";

import { z as zod } from "zod";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Stack,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
} from "@mui/material";

import { Form } from "@/components/hook-form";
import { CustomerGroup, CustomerGroupFormData } from "../types";
import {
  CUSTOMER_GROUP_ACTION,
  CUSTOMER_GROUP_STEPS,
} from "@/constants/customer-group";
import { ResearchCustomer } from "./steps/research-customer";
import { buildAnalysisContextData, buildAnalysisNeedData, buildCustomerResearchData, buildProposeSolutionData, getFieldsForStep, hasStepDataChanged, extractStepData } from "../utils";
import {
  createCustomerGroup,
  getCustomerGroups,
  updateCustomerGroup,
} from "@/actions/customer-group";
import {
  createCustomerInsightN8N,
  CustomerInsightRequest,
} from "@/actions/auto-mia";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LoadingOverlay } from "@/components/loading-overlay";
import { AnalysisContext } from "./steps/analysis-context";
import { AnalysisNeed } from "./steps/analysis-need";
import { ProposeSolution } from "./steps/propose-solution";
import {CreateCustomerInsight} from "./steps/create-customer-insight";
import { deleteCustomerInsight } from "@/actions/customer-insight";
import { paths } from "@/routes/path";

// ----------------------------------------------------------------------

type Props = {
  editData?: CustomerGroup;
};

const CustomerGroupSchema = zod.object({
  id: zod.number().nullable().default(null),
  name: zod.string().min(1, "Tên nhóm khách hàng là bắt buộc"),
  descriptions: zod.string().optional(),
  services: zod.array(zod.number()).min(1, "Dịch vụ là bắt buộc"),
  customer_journey_process: zod
    .number({ required_error: "Hành trình khách hàng là bắt buộc" })
    .min(1, "Hành trình khách hàng là bắt buộc"),
  action: zod.string().optional(),
  ai_note_analysis_context: zod.string().optional(),

  // step analysis context
  ai_analysis_context: zod.string().optional(),
  what: zod.string().optional(),
  who: zod.string().optional(),
  why: zod.string().optional(),
  where: zod.string().optional(),
  How: zod.string().optional(),
  When: zod.string().optional(),
});

export function CustomerGroupForm({ editData }: Props) {
  const [activeStep, setActiveStep] = useState(CUSTOMER_GROUP_STEPS[0].value);
  const [isNextLoading, setIsNextLoading] = useState(false);
      const router = useRouter();

  // Cache for storing step data after successful API calls
  const [cachedStepData, setCachedStepData] = useState<Record<string, Partial<CustomerGroupFormData> | null>>({});

  const defaultValues = useMemo(
    () => ({
      id: editData?.id || null,
      name: editData?.name || "",
      descriptions: editData?.descriptions || "",
      services:
        editData?.services?.map((service) =>
          Number(service.services_id.id)
        ) || [],
      customer_journey_process: editData?.customer_journey_process?.id ?? undefined,
      action: editData?.action || CUSTOMER_GROUP_STEPS[0].value,
      ai_note_analysis_context: editData?.ai_note_analysis_context || "",
      
      // step analysis context
      ai_note_analysis_need: editData?.ai_note_analysis_need || "",
      what: editData?.what || "",
      who: editData?.who || "",
      why: editData?.why || "",
      where: editData?.where || "",
      How: editData?.How || "",
      When: editData?.When || "",

      // step analysis need
      ai_note_propose_solution: editData?.ai_note_propose_solution || "",
      context: editData?.context || "",
      main_job: editData?.main_job || "",
      related_job: editData?.related_job || "",
      emotional_job: editData?.emotional_job || "",

      // step propose solution
      ai_note_create_insight: editData?.ai_note_create_insight || "",
      expected_outcome: editData?.expected_outcome || "",
      pain_point: editData?.pain_point || "",
      trigger: editData?.trigger || "",
      solution_idea: editData?.solution_idea || "",

      // step create insight
    }) as unknown as CustomerGroupFormData,
    [editData]
  );

  const methods = useForm<CustomerGroupFormData>({
    resolver: zodResolver(CustomerGroupSchema) as unknown as Resolver<CustomerGroupFormData>,
    defaultValues,
    mode:'onChange',
    shouldFocusError: true,
  });

  const {
    handleSubmit,
  } = methods;
  const onSubmit = handleSubmit(() => {});

  useEffect(() => {
    if (editData?.id) {
      setActiveStep(editData?.action || CUSTOMER_GROUP_STEPS[0].value);
      
      // Initialize cache with existing editData for all steps
      const initialCache: Record<string, Partial<CustomerGroupFormData> | null> = {};
      
      // Cache data for each step based on editData
      CUSTOMER_GROUP_STEPS.forEach(step => {
        initialCache[step.value] = extractStepData(defaultValues, step.value);
      });
      
      setCachedStepData(initialCache);
    }
  }, [editData, defaultValues]);

  const renderStepContent = {
    [CUSTOMER_GROUP_ACTION.RESEARCH_CUSTOMER]: <ResearchCustomer />,
    [CUSTOMER_GROUP_ACTION.ANALYSIS_CONTEXT]: <AnalysisContext />,
    [CUSTOMER_GROUP_ACTION.ANALYSIS_NEED]: <AnalysisNeed />,
    [CUSTOMER_GROUP_ACTION.PROPOSE_SOLUTION]: <ProposeSolution />,
    [CUSTOMER_GROUP_ACTION.CREATE_INSIGHT]: <CreateCustomerInsight customerGroupId={Number(methods.getValues("id"))} />,
  };

  const processN8NCreateCustomerInsight = async (
    customerGroupId: number,
    startStep: number,
    endStep: number
  ) => {
    const inputN8NData: CustomerInsightRequest[] = [
      {
        customer_group_id: customerGroupId,
        startStep,
        endStep,
      },
    ];
    const n8nResponse = await createCustomerInsightN8N(inputN8NData);
    if (!n8nResponse?.success) {
      toast.error(n8nResponse?.message || "Đã có lỗi xảy ra");
      return false;
    }
    return true;
  };

  const handleStepCustomerResearch = async (data: CustomerGroupFormData) => {
    try {
      setIsNextLoading(true);
      
      // Build previous data for comparison: use cached step data if available; otherwise null for new customer group
      const cachedData = cachedStepData[CUSTOMER_GROUP_ACTION.RESEARCH_CUSTOMER];
      const formValues = methods.getValues();
      const previousCustomerResearchData: CustomerGroupFormData | null = cachedData
        ? { ...formValues, ...cachedData } as CustomerGroupFormData
        : null;
      
      const hasChanged = hasStepDataChanged(
        data,
        previousCustomerResearchData,
        CUSTOMER_GROUP_ACTION.RESEARCH_CUSTOMER
      );

      // If in edit mode and no changes, just move to next step
      if (editData?.id && !hasChanged) {
        methods.setValue("id", editData.id);
        
        // Cache the step data for edit mode
        setCachedStepData(prev => ({
          ...prev,
          [CUSTOMER_GROUP_ACTION.RESEARCH_CUSTOMER]: extractStepData(data, CUSTOMER_GROUP_ACTION.RESEARCH_CUSTOMER)
        }));

        setActiveStep(CUSTOMER_GROUP_ACTION.ANALYSIS_CONTEXT);
        return;
      }
      
      // If in create mode and no changes, just move to next step
      if (!editData?.id && !hasChanged) {
        setActiveStep(CUSTOMER_GROUP_ACTION.ANALYSIS_CONTEXT);
        return;
      }
      
      // Set ID for edit mode before API call
      if (editData?.id) {
        methods.setValue("id", editData.id);
      }
      
      const apiData = buildCustomerResearchData(data);

      // check if id is exist in form -> update data to db, if not, create new customer group
      const idFromForm = methods.getValues("id") || editData?.id;
      const response = idFromForm ? await updateCustomerGroup(Number(idFromForm), apiData) : await createCustomerGroup(apiData);
      if (response?.data?.id) {
        methods.setValue("id", response.data.id);

        const n8nSuccess = await processN8NCreateCustomerInsight(
          response.data.id,
          1,
          2
        );
        if (!n8nSuccess) {
          return;
        }

        const newCustomerGroupDetail = await getCustomerGroups({
          id: response.data.id,
        });
        if (newCustomerGroupDetail) {
          const newData = newCustomerGroupDetail?.data?.[0];
          methods.setValue("who", newData?.who || "");
          methods.setValue("what", newData?.what || "");
          methods.setValue("why", newData?.why || "");
          methods.setValue("where", newData?.where || "");
          methods.setValue("How", newData?.How || "");
          methods.setValue("When", newData?.When || "");
        }

        // Cache the step data after successful API call
        setCachedStepData(prev => ({
          ...prev,
          [CUSTOMER_GROUP_ACTION.RESEARCH_CUSTOMER]: extractStepData(data, CUSTOMER_GROUP_ACTION.RESEARCH_CUSTOMER)
        }));

        setActiveStep(CUSTOMER_GROUP_ACTION.ANALYSIS_CONTEXT);
        return;
      }
    } catch {
      toast.error("Đã có lỗi xảy ra");
    } finally {
      setIsNextLoading(false);
    }
  };

  const handleStepAnalysisContext = async (data: CustomerGroupFormData) => {
    try {
      setIsNextLoading(true);
      const customerGroupId = methods.getValues("id");
      if (!customerGroupId) {
        toast.error("Không tìm thấy nhóm khách hàng");
        return;
      }
      
      // Build previous data for comparison: use cached step data if available; otherwise null for new customer group
      const cachedData = cachedStepData[CUSTOMER_GROUP_ACTION.ANALYSIS_CONTEXT];
      const formValues = methods.getValues();
      const previousAnalysisContextData: CustomerGroupFormData | null = cachedData
        ? { ...formValues, ...cachedData } as CustomerGroupFormData
        : null;

      const hasChanged = hasStepDataChanged(
        data,
        previousAnalysisContextData,
        CUSTOMER_GROUP_ACTION.ANALYSIS_CONTEXT
      );

      // Check if we should skip API call - only skip if current step data hasn't changed
      if (!hasChanged) {
        const nextStep = CUSTOMER_GROUP_STEPS.find(step => step.stepNumber === (CUSTOMER_GROUP_STEPS.find(s => s.value === CUSTOMER_GROUP_ACTION.ANALYSIS_CONTEXT)?.stepNumber || 0) + 1)?.value;
        if (nextStep) {
          setActiveStep(nextStep);
        }
        return;
      }

      const apiData = buildAnalysisContextData(data);
      const response = await updateCustomerGroup(
        customerGroupId,
        apiData
      );
      if(response?.data?.id) {
        const n8nSuccess = await processN8NCreateCustomerInsight(
          response.data.id,
          2,
          3
        );
         if (!n8nSuccess) {
          return;
        }
        const newCustomerGroupDetail = await getCustomerGroups({
          id: response.data.id,
        });
        if (newCustomerGroupDetail) {
          const newData = newCustomerGroupDetail?.data?.[0];
          methods.setValue("context", newData?.context || "");
          methods.setValue("main_job", newData?.main_job || "");
          methods.setValue("related_job", newData?.related_job || "");
          methods.setValue("emotional_job", newData?.emotional_job || "");
        }
        
        // Cache the step data after successful API call
        setCachedStepData(prev => ({
          ...prev,
          [CUSTOMER_GROUP_ACTION.ANALYSIS_CONTEXT]: extractStepData(data, CUSTOMER_GROUP_ACTION.ANALYSIS_CONTEXT)
        }));

        setActiveStep(CUSTOMER_GROUP_ACTION.ANALYSIS_NEED);
        return;
      }
    } catch {
      toast.error("Đã có lỗi xảy ra");
    } finally {
      setIsNextLoading(false);
    }
  };

  const handleStepAnalysisNeed = async (data: CustomerGroupFormData) => {
    try {
      setIsNextLoading(true);
      const customerGroupId = methods.getValues("id");
      if (!customerGroupId) {
        toast.error("Không tìm thấy nhóm khách hàng");
        return;
      }
      
      // Build previous data for comparison: use cached step data if available; otherwise null for new customer group
      const cachedData = cachedStepData[CUSTOMER_GROUP_ACTION.ANALYSIS_NEED];
      const formValues = methods.getValues();
      const previousAnalysisNeedData: CustomerGroupFormData | null = cachedData
        ? { ...formValues, ...cachedData } as CustomerGroupFormData
        : null;

      const hasChanged = hasStepDataChanged(
        data,
        previousAnalysisNeedData,
        CUSTOMER_GROUP_ACTION.ANALYSIS_NEED
      );

      // Check if we should skip API call - only skip if current step data hasn't changed
      if (!hasChanged) {
        const nextStep = CUSTOMER_GROUP_STEPS.find(step => step.stepNumber === (CUSTOMER_GROUP_STEPS.find(s => s.value === CUSTOMER_GROUP_ACTION.ANALYSIS_NEED)?.stepNumber || 0) + 1)?.value;
        if (nextStep) {
          setActiveStep(nextStep);
        }
        return;
      }

      const apiData = buildAnalysisNeedData(data);
      const response = await updateCustomerGroup(
        customerGroupId,
        apiData
      );

      if(response?.data?.id) {
        const n8nSuccess = await processN8NCreateCustomerInsight(
          response.data.id,
          3,
          4
        );
         if (!n8nSuccess) {
          return;
        }
        const newCustomerGroupDetail = await getCustomerGroups({
          id: response.data.id,
        });
        if (newCustomerGroupDetail) {
          const newData = newCustomerGroupDetail?.data?.[0];
          methods.setValue("expected_outcome", newData?.expected_outcome || "");
          methods.setValue("pain_point", newData?.pain_point || "");
          methods.setValue("trigger", newData?.trigger || "");
          methods.setValue("solution_idea", newData?.solution_idea || "");
        }
        
        // Cache the step data after successful API call
        setCachedStepData(prev => ({
          ...prev,
          [CUSTOMER_GROUP_ACTION.ANALYSIS_NEED]: extractStepData(data, CUSTOMER_GROUP_ACTION.ANALYSIS_NEED)
        }));

        setActiveStep(CUSTOMER_GROUP_ACTION.PROPOSE_SOLUTION);
        return;
      }
    } catch {
      toast.error("Đã có lỗi xảy ra");
    } finally {
      setIsNextLoading(false);
    }
  };

  const handleStepProposeSolution = async (data: CustomerGroupFormData) => {
    try {
      setIsNextLoading(true);
      const customerGroupId = methods.getValues("id");
      if (!customerGroupId) {
        toast.error("Không tìm thấy nhóm khách hàng");
        return;
      }
      
      // Build previous data for comparison: use cached step data if available; otherwise null for new customer group
      const cachedData = cachedStepData[CUSTOMER_GROUP_ACTION.PROPOSE_SOLUTION];
      const formValues = methods.getValues();
      const previousProposeSolutionData: CustomerGroupFormData | null = cachedData
        ? { ...formValues, ...cachedData } as CustomerGroupFormData
        : null;

      const hasChanged = hasStepDataChanged(
        data,
        previousProposeSolutionData,
        CUSTOMER_GROUP_ACTION.PROPOSE_SOLUTION
      );

      // Check if we should skip API call - only skip if current step data hasn't changed
      if (!hasChanged) {
        const nextStep = CUSTOMER_GROUP_STEPS.find(step => step.stepNumber === (CUSTOMER_GROUP_STEPS.find(s => s.value === CUSTOMER_GROUP_ACTION.PROPOSE_SOLUTION)?.stepNumber || 0) + 1)?.value;
        if (nextStep) {
          setActiveStep(nextStep);
        }
        return;
      }

      const apiData = buildProposeSolutionData(data);
      const response = await updateCustomerGroup(
        customerGroupId,
        apiData
      );

      if(response?.data?.id) {
        const n8nSuccess = await processN8NCreateCustomerInsight(
          response.data.id,
          4,
          5
        );
         if (!n8nSuccess) {
          return;
        }
        // Cache the step data after successful API call
        setCachedStepData(prev => ({
          ...prev,
          [CUSTOMER_GROUP_ACTION.PROPOSE_SOLUTION]: extractStepData(data, CUSTOMER_GROUP_ACTION.PROPOSE_SOLUTION)
        }));

        setActiveStep(CUSTOMER_GROUP_ACTION.CREATE_INSIGHT);
        return;
      }
    } catch {
      toast.error("Đã có lỗi xảy ra");
    } finally {
      setIsNextLoading(false);
    }
  };

  const handleStepCreateInsight = async (data: CustomerGroupFormData) => {
    try {
      setIsNextLoading(true);
      if (!data.id) {
        toast.error("Không tìm thấy nhóm khách hàng");
        return;
      }

      // Get deleted customer insights IDs from form values
      const deletedIds = methods.getValues("deleted_customer_insight_ids") || [];
      
      // Process deleted IDs if any
      if (deletedIds.length > 0) {
        // Delete customer insights
        await Promise.all(
          deletedIds.map((id) => deleteCustomerInsight(id))
        );

      }
      toast.success("Lưu thông tin nhóm khách hàng thành công");
      setTimeout(() => {
      router.push(paths.dashboard.customerGroup.root)
    }, 500);

    } catch {
      toast.error("Đã có lỗi xảy ra");
    } finally {
      setIsNextLoading(false);
    }
  };


  const handleNext = async () => {
    if (!activeStep) return;
    const fieldsToValidate = getFieldsForStep(activeStep);
    const isStepValid = await methods.trigger(fieldsToValidate);
    if (!isStepValid) return;

    const formData = methods.getValues();

    switch (activeStep) {
      case CUSTOMER_GROUP_ACTION.RESEARCH_CUSTOMER:
        await handleStepCustomerResearch(formData);
        break;
      case CUSTOMER_GROUP_ACTION.ANALYSIS_CONTEXT:
        await handleStepAnalysisContext(formData);
        break;
      case CUSTOMER_GROUP_ACTION.ANALYSIS_NEED:
        await handleStepAnalysisNeed(formData);
        break;
      case CUSTOMER_GROUP_ACTION.PROPOSE_SOLUTION:
        await handleStepProposeSolution(formData);
        break;
      case CUSTOMER_GROUP_ACTION.CREATE_INSIGHT:
        await handleStepCreateInsight(formData);
        break;
      default:
        break;
    }
  };

  const handleBack = useCallback(() => {
    if(!activeStep ) return null;
     const currentIndex = CUSTOMER_GROUP_STEPS.findIndex(
      (step) => step.value === activeStep
    );
    if (currentIndex > 0) {
      setActiveStep(CUSTOMER_GROUP_STEPS[currentIndex - 1].value);
    }
  }, [activeStep]);

  const renderLabelNextStep = {
    [CUSTOMER_GROUP_ACTION.RESEARCH_CUSTOMER]: "Phân tích bối cảnh",
    [CUSTOMER_GROUP_ACTION.ANALYSIS_CONTEXT]: "Phân tích nhu cầu",
    [CUSTOMER_GROUP_ACTION.ANALYSIS_NEED]: "Đề xuất giải pháp",
    [CUSTOMER_GROUP_ACTION.PROPOSE_SOLUTION]: "Tạo hành vi khách hàng",
    [CUSTOMER_GROUP_ACTION.CREATE_INSIGHT]: "Lưu thay đổi",
  };

  const getLoadingMessage = () => {
    switch (activeStep) {
      case CUSTOMER_GROUP_ACTION.RESEARCH_CUSTOMER:
        return "Đang phân tích bối cảnh...";
      case CUSTOMER_GROUP_ACTION.ANALYSIS_CONTEXT:
        return "Đang phân tích nhu cầu...";
      case CUSTOMER_GROUP_ACTION.ANALYSIS_NEED:
        return "Đang đề xuất giải pháp...";
      case CUSTOMER_GROUP_ACTION.PROPOSE_SOLUTION:
        return "Đang tạo hành vi khách hàng...";
      default:
        return "Đang xử lý...";
    }
  };

  return (
    <>
      <LoadingOverlay
        open={isNextLoading}
        title="Đang xử lý..."
        description={getLoadingMessage()}
      />
      <Form methods={methods} onSubmit={onSubmit}>
        <Stack>
          <Box sx={{ width: "100%", mb: 4 }}>
            <Stepper
              activeStep={CUSTOMER_GROUP_STEPS.findIndex(
                (step) => step.value === activeStep
              )}
              alternativeLabel
            >
              {CUSTOMER_GROUP_STEPS.map((step) => (
                <Step key={step.value}>
                  <StepLabel
                    sx={{
                      cursor: "default",
                      "& .MuiStepLabel-label": {
                        fontSize: "0.875rem",
                        fontWeight: 500,
                      },
                      "& .MuiStepIcon-text": {
                        fill: "white",
                      },
                      "& .MuiStepIcon-root": {
                        fontSize: "2rem",
                      },
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        {step.label}
                      </Typography>
                    </Box>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              border: (theme) => `dashed 1px ${theme.palette.divider}`,
            }}
          >
            {renderStepContent[activeStep]}
          </Box>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{
              position: "sticky",
              bottom: 0,
              backgroundColor: "background.paper",
              py: 2,
              mb: 2,
              zIndex: 1000,
            }}
          >
           {
             activeStep !== CUSTOMER_GROUP_STEPS[0].value && (
               <Button
                size="large"
                variant="outlined"
                onClick={handleBack}
                disabled={activeStep === CUSTOMER_GROUP_STEPS[0].value}
                sx={{ minWidth: 150, borderRadius: 2 }}
              >
                Quay lại
              </Button>
             )
           }
            <Button
              size="large"
              variant="contained"
              onClick={handleNext}
              disabled={false}
              sx={{ minWidth: 150, borderRadius: 2 }}
            >
              {renderLabelNextStep[activeStep]}
            </Button>
          </Stack>
        </Stack>
      </Form>
    </>
  );
}
