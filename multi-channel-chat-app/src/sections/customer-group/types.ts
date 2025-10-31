// ----------------------------------------------------------------------

export interface CustomerGroup {
  id: number | string;
  name: string;
  action: string | null;
  descriptions: string | null;
  services: {
    services_id: {
      id: number;
      name: string;
    };
  }[];
  customer_journey_process?: {
    id: number;
  };
  [key: string]: unknown;
}

export interface CustomerGroupFormData {
  id?: string | number | null;

  //step research customer
  name?: string;
  descriptions?: string;
  services?: number[];
  customer_journey_process?: number | {
    id: number;
  };
  action?: string;
  ai_note_analysis_context?: string;

// step analysis context
  ai_note_analysis_need?: string;
  what?: string;
  who?: string;
  why?: string;
  where?: string;
  How?: string;
  When?: string;

  // step analysis need
  ai_note_propose_solution?: string;
  context?: string;
  main_job?: string;
  related_job?: string;
  emotional_job?: string;

  // step propose solution
  ai_note_create_insight?: string;
  expected_outcome?: string;
  pain_point?: string;
  trigger?: string;
  solution_idea?: string;

  // step create insight
  deleted_customer_group_customer_journey_ids?: string[];
}

export interface CustomerGroupCreateData {
  name?: string;
  descriptions?: string;
  services?: {
    create: Array<{
      customer_group_id: string;
      services_id: {
        id: number;
      };
    }>;
    update: Array<unknown>;
    delete: Array<unknown>;
  };
  customer_journey_process?: number;
  action?: string;
  ai_note_analysis_context?: string;

  ai_note_analysis_need?: string;
  what?: string;
  who?: string;
  why?: string;
  where?: string;
  How?: string;
  When?: string;

  ai_note_propose_solution?: string;
  context?: string;
  main_job?: string;
  related_job?: string;
  emotional_job?: string;

  ai_note_create_insight?: string;
  expected_outcome?: string;
  pain_point?: string;
  trigger?: string;
  solution_idea?: string;
}

export interface CustomerGroupResponse {
  data: {
    id: number;
    name: string;
    descriptions: string | null;
    action: string | null;
    what: string | null;
    who: string | null;
    why: string | null;
    where: string | null;
    How: string | null;
    When: string | null;
    context: string | null;
    main_job: string | null;
    related_job: string | null;
    emotional_job: string | null;
    expected_outcome: string | null;
    pain_point: string | null;
    trigger: string | null;
    solution_idea: string | null;
    customer_journey_process: number | null;
    ai_note_analysis_context: string | null;
    ai_note_analysis_need: string | null;
    ai_note_propose_solution: string | null;
    ai_note_create_insight: string | null;
    customer_journey: Array<unknown>;
    services: Array<number>;
    ai_content_suggestions: Array<unknown>;
    campaign: Array<unknown>;
  };
}