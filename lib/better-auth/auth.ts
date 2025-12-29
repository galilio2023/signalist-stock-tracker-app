import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";

let authInstance: ReturnType<typeof betterAuth> | null = null;

const getAuth = async () => {
  if (authInstance) return authInstance;
  
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not set");
  }

  try {
    // Connect to MongoDB directly
    const { MongoClient } = await import("mongodb");
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    // Use the correct database name (from your test, it's "test")
    const db = client.db("test");
    
    console.log("Better Auth connected to MongoDB database: test");

    authInstance = betterAuth({
      database: mongodbAdapter(db),
      secret: process.env.BETTER_AUTH_SECRET!,
      baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
      emailAndPassword: {
        enabled: true,
        disableSignUp: false,
        requireEmailVerification: false,
        minPasswordLength: 8,
        maxPasswordLength: 128,
        autoSignIn: true,
      },
      plugins: [nextCookies()],
    });

    return authInstance;
  } catch (error: any) {
    console.error("Auth initialization error:", error);
    throw new Error(`Authentication setup failed: ${error.message}`);
  }
};

// Create a lazy-loaded auth object
export const auth = {
  api: {
    getSession: async (params: any) => {
      const authInstance = await getAuth();
      return authInstance.api.getSession(params);
    },
    signUpEmail: async (params: any) => {
      const authInstance = await getAuth();
      return authInstance.api.signUpEmail(params);
    },
    signInEmail: async (params: any) => {
      const authInstance = await getAuth();
      return authInstance.api.signInEmail(params);
    },
    signOut: async (params: any) => {
      const authInstance = await getAuth();
      return authInstance.api.signOut(params);
    },
  },
};
