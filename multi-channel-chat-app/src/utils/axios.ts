/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import https from "https";

// ----------------------------------------------------------------------

import { CONFIG } from "@/config-global";
import { SWRConfiguration } from "swr";
import { signOut } from "@/actions/auth";
import { toast } from "@/components/snackbar";

export const swrConfig: SWRConfiguration = {
  revalidateOnFocus: false,
};

const agent = new https.Agent({
  rejectUnauthorized: false,
});

const axiosInstance = axios.create({
  baseURL: CONFIG.serverUrl,
  httpsAgent: process.env.NODE_ENV === "development" ? agent : undefined,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 403 Forbidden - Auto logout
    if (error.response?.status === 403) {
      try {
        signOut();
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        
        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/sign-in';
        }
      } catch (logoutError) {
        console.error("Error during auto logout:", logoutError);
      }
    }

    return Promise.reject(
      (error.response &&
        error.response.data &&
        error.response.data.errorMessage) ||
        "Something went wrong!"
    );
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

// Auto MIA Solution axios instance
const autoMiaAxiosInstance = axios.create({
  baseURL: "https://auto.miasolution.vn/",
  httpsAgent: process.env.NODE_ENV === "development" ? agent : undefined,
});

autoMiaAxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 403 Forbidden - Auto logout
    if (error.response?.status === 403) {
      try {
        signOut();
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        
        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/sign-in';
        }
      } catch (logoutError) {
        console.error("Error during auto logout:", logoutError);
      }
    }

    return Promise.reject(
      (error.response &&
        error.response.data &&
        error.response.data.errorMessage) ||
        "Something went wrong!"
    );
  }
);

export { autoMiaAxiosInstance };

// ----------------------------------------------------------------------

export const fetcher = async (args: any) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error("Failed to fetch:", error);
    throw error;
  }
};

// Auto MIA Solution fetcher
export const autoMiaFetcher = async (args: any) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await autoMiaAxiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error("Failed to fetch from Auto MIA:", error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    me: "/users/me",
    signIn: "/auth/login",
    googleSignIn: "/api/auth/google/callback",
    facebookSignIn: "/api/auth/facebook/callback",
    signUp: "/api/auth/local/register",
    forgotPassword: "/api/auth/forgot-password",
    resetPassword: "/api/auth/reset-password",
    changePassword: "/api/auth/change-password",
  },
  user: {
    list: "/users",
    update: "/users",
  },
  customers: {
    list: "/items/customers",
    update: "/items/customers",
    create: "/items/customers",
    delete: "/items/customers",
    deleteBulk: "/items/customers/bulk-delete",
  },
  products: {
    list: "/api/products",
    tags: "/api/products/tags",
    update: "/api/products",
    create: "/api/products",
    delete: "/api/products",
    deleteBulk: "/api/products/bulk-delete",
  },
  productUnitOfMeasure: {
    list: "/api/product-unit-of-measures",
    update: "/api/product-unit-of-measures",
    create: "/api/product-unit-of-measures",
    delete: "/api/product-unit-of-measures",
    deleteBulk: "/api/product-unit-of-measures/bulk-delete",
  },
  categories: {
    list: "/api/categories",
    create: "/api/categories",
    update: "/api/categories",
    delete: "/api/categories",
    deleteBulk: "/api/categories/bulk-delete",
  },
  suppliers: {
    list: "/api/suppliers",
    update: "/api/suppliers",
    delete: "/api/suppliers",
    create: "/api/suppliers",
    deleteBulk: "/api/suppliers/bulk-delete",
  },
  purchaseOrders: {
    list: "/api/purchase-orders",
    update: "/api/purchase-orders",
    delete: "/api/purchase-orders",
    create: "/api/purchase-orders",
    deleteBulk: "/api/purchase-orders/bulk-delete",
  },
  salesOrders: {
    list: "/api/sales-orders",
    update: "/api/sales-orders",
    delete: "/api/sales-orders",
    create: "/api/sales-orders",
  },
  inventoryTransactions: {
    list: "/api/inventory-transactions",
  },
  conversations: {
    list: "items/mc_conversations",
    create: "items/mc_conversations",
    update: "items/mc_conversations",
  },
  messages: {
    list: "items/mc_messages",
    create: "items/mc_messages",
  },
  upload: "/api/upload",
  files: "/files",
  chat: "/api/chat",
  contentTones: {
    list: "/api/content-tones",
    create: "/api/content-tones",
    update: "/api/content-tones",
    delete: "/api/content-tones",
  },
  aiRules: {
    list: "/items/ai_rule_based",
    create: "/items/ai_rule_based",
    update: "/items/ai_rule_based",
    delete: "/items/ai_rule_based",
  },
  customerGroups: {
    list: "/items/customer_group",
    create: "/items/customer_group",
    update: "/items/customer_group",
    delete: "/items/customer_group",
  },
  customerJourneys: {
    list: "/items/customer_journey",
    create: "/items/customer_journey",
    update: "/items/customer_journey",
    delete: "/items/customer_journey",
  },
  customerJourneyProcess: {
    list: "/items/customer_journey_process",
    create: "/items/customer_journey_process",
    update: "/items/customer_journey_process",
    delete: "/items/customer_journey_process",
  },
  omniChannels: {
    list: "/items/omni_channels",
  },
  services: {
    list: "/items/services",
    create: "/items/services",
    update: "/items/services",
    delete: "/items/services",
  },
  campaign: {
    list: "/items/campaign",
    create: "/items/campaign",
    update: "/items/campaign",
    delete: "/items/campaign",
  },
};
