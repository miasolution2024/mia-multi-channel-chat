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
    customer: {
      root: `${ROOTS.DASHBOARD}/customer`,
    },
    supplier: {
      root: `${ROOTS.DASHBOARD}/supplier`,
    },
    category: {
      root: `${ROOTS.DASHBOARD}/category`,
    },
    purchaseOrder: {
      root: `${ROOTS.DASHBOARD}/purchase-order`,
      new: `${ROOTS.DASHBOARD}/purchase-order/new`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/purchase-order/${id}/edit`,
      details: (id: string) => `${ROOTS.DASHBOARD}/purchase-order/${id}`,
    },
    salesOrder: {
      root: `${ROOTS.DASHBOARD}/sales-order`,
      details: (id: string) => `${ROOTS.DASHBOARD}/sales-order/${id}`,
    },
    product: {
      root: `${ROOTS.DASHBOARD}/product`,
      new: `${ROOTS.DASHBOARD}/product/new`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/product/${id}/edit`,
    },
    inventoryTransaction: {
      root: `${ROOTS.DASHBOARD}/inventory-transaction`,
    },
  },
};
