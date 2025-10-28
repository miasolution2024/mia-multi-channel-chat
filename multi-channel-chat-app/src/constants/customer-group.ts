export const CUSTOMER_GROUP_ACTION = {
    RESEARCH_CUSTOMER: 'research_customer',
    ANALYSIS_CONTEXT: 'analysis_context',
    ANALYSIS_NEED: 'analysis_need',
    PROPOSE_SOLUTION: 'propose_solution',
    CREATE_INSIGHT: 'create_insight',
    DONE: 'done',
}


export const CUSTOMER_GROUP_STEPS = [
  {
    value: CUSTOMER_GROUP_ACTION.RESEARCH_CUSTOMER,
    label: "Nghiên cứu khách hàng",
    stepNumber: 1,
  },
  {
    value: CUSTOMER_GROUP_ACTION.ANALYSIS_CONTEXT,
    label: "Phân tích bối cảnh",
    stepNumber: 2,
  },
  {
    value: CUSTOMER_GROUP_ACTION.ANALYSIS_NEED,
    label: "Phân tích nhu cầu",
    stepNumber: 3,
  },
    {
    value: CUSTOMER_GROUP_ACTION.PROPOSE_SOLUTION,
    label: "Đề xuất giải pháp",
    stepNumber: 4,
  },
    {
    value: CUSTOMER_GROUP_ACTION.CREATE_INSIGHT,
    label: "Tạo hành vi khách hàng",
    stepNumber: 5,
  },
];