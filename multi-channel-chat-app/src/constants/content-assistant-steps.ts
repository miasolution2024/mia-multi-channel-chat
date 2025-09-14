import { POST_STEP } from "@/constants/auto-post";

// Mapping current_step to startStep for publishing
export const CONTENT_STEP_TO_START_STEP: Record<string, number> = {
  [POST_STEP.RESEARCH_ANALYSIS]: 1, // research
  [POST_STEP.MAKE_OUTLINE]: 2, // outline
  [POST_STEP.GENERATE_IMAGE]: 3, // create_image_ai
  [POST_STEP.WRITE_ARTICLE]: 4, // write content
  [POST_STEP.HTML_CODING]: 5, // html coding
  [POST_STEP.PUBLISHED]: 6, // publish
};

