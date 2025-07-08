/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import https from "https";

// ----------------------------------------------------------------------

import { CONFIG } from "@/config-global";

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
    Promise.reject(
      (error.response &&
        error.response.data &&
        error.response.data.errorMessage) ||
        "Something went wrong!"
    );
  }
);

export default axiosInstance;

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

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    me: "/api/auth/me",
    signIn: "/api/auth/signin",
    googleSignIn: "/api/auth/google/callback",
    facebookSignIn: "/api/auth/facebook/callback",
    signUp: "/api/auth/local/register",
    forgotPassword: "/api/auth/forgot-password",
    resetPassword: "/api/auth/reset-password",
    changePassword: "/api/auth/change-password",
  },
  user: {
    list: "/api/users",
    update: "/api/users",
  },
  customers: {
    list: "/api/customers",
    update: "/api/customers",
    create: "/api/customers",
    delete: "/api/customers",
    deleteBulk: "/api/customers/bulk-delete",
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
  salesOrders:{
    list: "/api/sales-orders",
    update: "/api/sales-orders",
    delete: "/api/sales-orders",
    create: "/api/sales-orders",
  },
  inventoryTransactions: {
    list: "/api/inventory-transactions",
  },
  upload: "/api/upload",
  chat: '/api/chat',
};
