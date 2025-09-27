export const CAMPAIGN_STEP_KEY = {
  CAMPAIGN_INFO: "campaign_info",
  POST_CONTENT_INFO:'post_content_info',
  CREATE_POST_LIST:'create_post_list',
};

export const CAMPAIGN_STEPS = [
  {
    value: CAMPAIGN_STEP_KEY.CAMPAIGN_INFO,
    label: "Thông tin chiến dịch",
    stepNumber: 1,
  },
  {
    value: CAMPAIGN_STEP_KEY.POST_CONTENT_INFO,
    label: "Thông tin bài viết",
    stepNumber: 2,
  },
  {
    value: CAMPAIGN_STEP_KEY.CREATE_POST_LIST,
    label: "Tạo danh sách bài viết",
    stepNumber: 3,
  },
];

export const CAMPAIGN_STATUS = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
}
