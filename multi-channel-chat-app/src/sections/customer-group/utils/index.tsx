import { CUSTOMER_GROUP_ACTION } from "@/constants/customer-group";
import { CustomerGroupCreateData, CustomerGroupFormData } from "../types";

export const getFieldsForStep = (step: string): (keyof CustomerGroupFormData)[] => {
  switch (step) {
    case CUSTOMER_GROUP_ACTION.RESEARCH_CUSTOMER:
      return [
        "ai_note_analysis_context",
        "name",
        "customer_journey_process",
        "services",
        "descriptions",
      ];
    case CUSTOMER_GROUP_ACTION.ANALYSIS_CONTEXT:
      return [
        "what",
        "who", 
        "why",
        "where",
        "How",
        "When",
        "ai_note_analysis_need",
      ];
    case CUSTOMER_GROUP_ACTION.ANALYSIS_NEED:
      return [
        "ai_note_propose_solution",
        "context",
        "main_job",
        "related_job",
        "emotional_job",
      ];
    case CUSTOMER_GROUP_ACTION.PROPOSE_SOLUTION:
      return [
        "ai_note_create_insight",
        "expected_outcome",
        "pain_point",
        "trigger",
        "solution_idea",
      ];
    default:
      return [];
  }
};

export const buildCustomerResearchData = (formData: CustomerGroupFormData): CustomerGroupCreateData => {
  return {
    ai_note_analysis_context: formData.ai_note_analysis_context,
    name: formData.name,
    customer_journey_process: typeof formData.customer_journey_process === 'object' 
      ? formData.customer_journey_process?.id 
      : formData.customer_journey_process,
    action: CUSTOMER_GROUP_ACTION.RESEARCH_CUSTOMER,
    services: {
      create: (formData.services || []).map((id: number) => ({
        customer_group_id: "+",
        services_id: { id: Number(id) },
      })),
      update: [],
      delete: [],
    },
    descriptions: formData.descriptions,
  };
}

export const buildAnalysisContextData = (formData: CustomerGroupFormData): CustomerGroupCreateData => {
  return {
    ai_note_analysis_need: formData.ai_note_analysis_need,
    who: formData.who,
    what: formData.what,
    why: formData.why,
    where: formData.where,
    How: formData.How,
    When: formData.When,
  };
}

export const buildAnalysisNeedData = (formData: CustomerGroupFormData): CustomerGroupCreateData => {
  return {
    ai_note_propose_solution: formData.ai_note_propose_solution,
    context: formData.context,
    main_job: formData.main_job,
    related_job: formData.related_job,
    emotional_job: formData.emotional_job,
  };
}

export const buildProposeSolutionData = (formData: CustomerGroupFormData): CustomerGroupCreateData => {
  return {
    ai_note_create_insight: formData.ai_note_create_insight,
    expected_outcome: formData.expected_outcome,
    pain_point: formData.pain_point,
    trigger: formData.trigger,
    solution_idea: formData.solution_idea,
  };
}

// Utility functions for data comparison and caching
export const compareArrays = (arr1: unknown[], arr2: unknown[]): boolean => {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((item, index) => item === arr2[index]);
};

export const compareDates = (date1: Date | null, date2: Date | null): boolean => {
  if (date1 === null && date2 === null) return true;
  if (date1 === null || date2 === null) return false;
  return date1.getTime() === date2.getTime();
};

// Compare form data for specific step to detect changes
export const hasStepDataChanged = (
  currentData: CustomerGroupFormData,
  cachedData: Partial<CustomerGroupFormData> | null,
  step: string
): boolean => {
  
  if (!cachedData) {
    return true;
  }

  const fieldsToCompare = getFieldsForStep(step);
  
  const hasChanges = fieldsToCompare.some((field) => {
    const currentValue = currentData[field];
    const cachedValue = cachedData[field];
    
    // Handle array comparison
    if (Array.isArray(currentValue) && Array.isArray(cachedValue)) {
      const arrayChanged = !compareArrays(currentValue, cachedValue);
      return arrayChanged;
    }

    // Handle date comparison
    if (currentValue instanceof Date || cachedValue instanceof Date) {
      const dateChanged = !compareDates(currentValue as Date | null, cachedValue as Date | null);
      return dateChanged;
    }

    // Handle primitive values
    const primitiveChanged = currentValue !== cachedValue;
    return primitiveChanged;
  });
  
  return hasChanges;
};

// Extract data for specific step
export const extractStepData = (
  formData: CustomerGroupFormData,
  step: string
): Partial<CustomerGroupFormData> => {
  
  const fieldsForStep = getFieldsForStep(step);
  
  const stepData: Partial<CustomerGroupFormData> = {};

  fieldsForStep.forEach((field) => {
    const value = formData[field];
    (stepData as Record<string, unknown>)[field] = value;
  });

  return stepData;
};
