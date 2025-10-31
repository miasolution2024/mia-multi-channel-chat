const ROOTS = {
  AUTH: "/auth",
  DASHBOARD: "/dashboard",
};

export const paths = {
  about: "/about-us",
  contact: "/contact-us",
  faqs: "/faqs",
  page403: "/error/403",
  page404: "/error/404",
  page500: "/error/500",
  profile: "/user/profile",
  auth: {
    signIn: `${ROOTS.AUTH}/sign-in`,
    signUp: `${ROOTS.AUTH}/sign-up`,
    resetPassword: `${ROOTS.AUTH}/reset-password`,
    waitingConfirmation: `${ROOTS.AUTH}/waiting-confirmation`,
    seamlessAuth: `${ROOTS.AUTH}/seamless-auth`,
  },
  dashboard: {
    root: `${ROOTS.DASHBOARD}/content-assistant`,
    chat: `${ROOTS.DASHBOARD}/chat`,
    contentAssistant: {
      root: `${ROOTS.DASHBOARD}/content-assistant`,
      new: `${ROOTS.DASHBOARD}/content-assistant/new`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/content-assistant/${id}/edit`,
    },
    contentTone: {
      root: `${ROOTS.DASHBOARD}/content-tone`,
      new: `${ROOTS.DASHBOARD}/content-tone/new`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/content-tone/${id}/edit`,
    },
    aiRules: {
      root: `${ROOTS.DASHBOARD}/ai-rules`,
      new: `${ROOTS.DASHBOARD}/ai-rules/new`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/ai-rules/${id}/edit`,
    },
    marketingCampaign: {
      root: `${ROOTS.DASHBOARD}/marketing-campaign`,
      new: `${ROOTS.DASHBOARD}/marketing-campaign/new`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/marketing-campaign/${id}/edit`,
    },
    scheduleCalendar: {
      root: `${ROOTS.DASHBOARD}/schedule-calendar`,
      new: `${ROOTS.DASHBOARD}/schedule-calendar/new`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/schedule-calendar/${id}/edit`,
    },
    customerJourney: {
      root: `${ROOTS.DASHBOARD}/customer-journey`,
      new: `${ROOTS.DASHBOARD}/customer-journey/new`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/customer-journey/${id}/edit`,
    },
    customerJourneyProcess: {
      root: `${ROOTS.DASHBOARD}/customer-journey-process`,
      new: `${ROOTS.DASHBOARD}/customer-journey-process/new`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/customer-journey-process/${id}/edit`,
    },
    customerInsight: {
      root: `${ROOTS.DASHBOARD}/customer-insight`,
      new: `${ROOTS.DASHBOARD}/customer-insight/new`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/customer-insight/${id}/edit`,
    },
    customerGroup: {
      root: `${ROOTS.DASHBOARD}/customer-group`,
      new: `${ROOTS.DASHBOARD}/customer-group/new`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/customer-group/${id}/edit`,
    },
  },
};
