export const POST_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
};

export const POST_TYPE = {
  SOCIAL_POST: "social_post",
  SEO_POST: "seo_post",
  FACEBOOK_POST: "facebook_post",
};

export const POST_TYPE_OPTIONS = [
  { value: POST_TYPE.SOCIAL_POST, label: "Bài viết xã hội" },
  { value: POST_TYPE.SEO_POST, label: "Bài viết SEO" },
  { value: POST_TYPE.FACEBOOK_POST, label: "Bài viết Facebook" },
];

export const POST_STEP = {
  RESEARCH_ANALYSIS: "research_analysis",
  MAKE_OUTLINE: "make_outline",
  WRITE_ARTICLE: "write_article",
  GENERATE_IMAGE: "generate_image",
  HTML_CODING: "HTML_coding",
  PUBLISHED: "published",
};
