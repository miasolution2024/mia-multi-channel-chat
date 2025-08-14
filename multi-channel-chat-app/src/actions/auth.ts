import { CONFIG } from "@/config-global";
import { SignInRequest } from "@/models/auth/sign-in";
import { SignUpRequest } from "@/models/auth/sign-up";
import { endpoints } from "@/utils/axios";
import axios from "../utils/axios";
import { setSession } from "@/auth/utils";
import { ResetPassword } from "@/models/auth/reset-password";
import { ChangePassword } from "@/models/auth/change-password";

// ----------------------------------------------------------------------

export const signInAsync = async (request: SignInRequest) => {
  try {
    const response = await axios.post(endpoints.auth.signIn, request);

    const { access_token: token } = response.data.data;

    if (!token) {
      throw new Error("Access token not found in response");
    }

    setSession(token);
  } catch (error) {
    console.error("Error during sign in:", error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const googleSignInAsync = async (search: string) => {
  try {
    const response = await axios.get(`${endpoints.auth.googleSignIn}${search}`);

    const { jwt } = response.data;

    if (!jwt) {
      throw new Error("Access token not found in response");
    }

    setSession(jwt);
  } catch (error) {
    console.error("Error during sign in:", error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const facebookSignInAsync = async (search: string) => {
  try {
    const response = await axios.get(
      `${endpoints.auth.facebookSignIn}${search}`
    );

    const { jwt } = response.data;

    if (!jwt) {
      throw new Error("Access token not found in response");
    }

    setSession(jwt);
  } catch (error) {
    console.error("Error during sign in:", error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const resetPasswordAsync = async ({ email }: { email: string }) => {
  try {
    const response = await axios.post(endpoints.auth.forgotPassword, { email });
    console.log(response);
  } catch (error) {
    console.error("Error during reset password:", error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const updatePasswordAsync = async (request: ResetPassword) => {
  try {
    const response = await axios.post(endpoints.auth.resetPassword, request);
    console.log(response);
  } catch (error) {
    console.error("Error during update password:", error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const changePasswordAsync = async (request: ChangePassword) => {
  try {
    const response = await axios.post(endpoints.auth.changePassword, request);

    const { jwt } = response.data;

    if (!jwt) {
      throw new Error("Access token not found in response");
    }

    setSession(jwt);
  } catch (error) {
    console.error("Error during change password:", error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const signUpAsync = async (request: SignUpRequest) => {
  try {
    await axios.post(endpoints.auth.signUp, request);
  } catch (error) {
    console.error("Error during sign up:", error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const signOut = () => {
  try {
    localStorage.removeItem(CONFIG.STORAGE_KEY);
    delete axios.defaults.headers.common.Authorization;
  } catch (error) {
    console.error("Error during sign out:", error);
    throw error;
  }
};
