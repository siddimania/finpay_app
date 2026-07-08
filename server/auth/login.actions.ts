"use server";

import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { loginFormSchema } from "@/utils/schema/auth";
import { redirect } from "next/navigation";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants";

type ActionResponse = {
  success: boolean;
  errorMessage: string | null;
};

export const loginAction = async (
  data: z.infer<typeof loginFormSchema>,
): Promise<ActionResponse> => {
  try {
    const { email, password } = loginFormSchema.parse(data);
    const supabase = await createClient();
    const supabaseDataParams = { email, password };
    const { error } =
      await supabase.auth.signInWithPassword(supabaseDataParams);
    if (error) {
      if(error?.message === "Email not confirmed") {
        return {
          success: false,
          errorMessage: SUCCESS_MESSAGES.SIGN_UP_VERIFY_LINK_SENT,
        };
      } else {
        throw error;
      }
    }

    return { success: true, errorMessage: null };
  } catch (error) {
    return {
      success: false,
      errorMessage: ERROR_MESSAGES.SIGN_IN_WITH_EMAIL_ERROR,
    };
  }
};

export async function signOutAction() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
    return { success: true, errorMessage: null };
  } catch (error) {
    return { success: false, errorMessage: ERROR_MESSAGES.SIGN_OUT_ERROR };
  }
}

