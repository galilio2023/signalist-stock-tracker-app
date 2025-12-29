"use server";

import { auth } from "@/lib/better-auth/auth";
import { inngest } from "@/lib/inngest/client";
import { headers } from "next/headers";

export const signUpWithEmail = async ({
  email,
  password,
  fullName,
  country,
  investmentGoals,
  riskTolerance,
  preferredIndustry,
}: SignUpFormData) => {
  console.log("Attempting signup for:", email);
  
  try {
    const response = await auth.api.signUpEmail({
      body: { email, password, name: fullName },
    });

    console.log("Signup response:", response);

    if (response) {
      await inngest.send({
        name: "app/user.created",
        data: {
          email,
          name: fullName,
          country,
          investmentGoals,
          riskTolerance,
          preferredIndustry,
        },
      });
    }

    return { success: true, data: response };
  } catch (e: any) {
    console.log("Sign up failed with error:", e);
    console.log("Full error object:", JSON.stringify(e, null, 2));
    
    // User-friendly error messages
    let errorMessage = "Sign up failed. Please try again.";
    
    if (e.message?.includes("already exists") || e.message?.includes("duplicate") || e.message?.includes("E11000")) {
      errorMessage = "An account with this email already exists. Please sign in instead.";
    } else if (e.message?.includes("Invalid id value")) {
      errorMessage = "There was a problem creating your account. Please try again.";
    } else if (e.message?.includes("password")) {
      errorMessage = "Password requirements not met. Please use a stronger password.";
    } else if (e.message?.includes("email")) {
      errorMessage = "Please enter a valid email address.";
    } else if (e.message?.includes("MongoDB") || e.message?.includes("connection")) {
      errorMessage = "We're experiencing technical issues. Please try again later.";
    }
    
    return { 
      success: false, 
      error: errorMessage 
    };
  }
};

export const signInWithEmail = async ({ email, password }: SignInFormData) => {
  console.log("Attempting signin for:", email);
  
  try {
    const response = await auth.api.signInEmail({ 
      body: { email, password } 
    });

    return { success: true, data: response };
  } catch (e: any) {
    console.log("Sign in failed:", e);
    
    // User-friendly error messages
    let errorMessage = "Sign in failed. Please check your credentials.";
    
    if (e.message?.includes("invalid credentials") || e.message?.includes("Invalid email or password")) {
      errorMessage = "Invalid email or password. Please try again.";
    } else if (e.message?.includes("not found")) {
      errorMessage = "No account found with this email. Please sign up first.";
    } else if (e.message?.includes("MongoDB") || e.message?.includes("connection")) {
      errorMessage = "We're experiencing technical issues. Please try again later.";
    }
    
    return { 
      success: false, 
      error: errorMessage 
    };
  }
};

export const signOut = async () => {
  try {
    await auth.api.signOut({ headers: await headers() });
  } catch (e: any) {
    console.log("Sign out failed", e);
    return { success: false, error: "Failed to sign out. Please try again." };
  }
};
