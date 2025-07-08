"use client";

import { User } from "@/models/auth/user";
import { createContext } from "react";

// ----------------------------------------------------------------------
export interface AuthContextType {
  user: User | null;
  checkUserSession: () => Promise<void>;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
}
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
