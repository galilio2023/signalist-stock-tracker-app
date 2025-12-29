import React from "react";
import Header from "@/components/Header";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user: User | undefined = undefined;
  
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    
    // Convert Better Auth user to our User type
    if (session?.user) {
      user = {
        id: session.user.id,
        name: session.user.name || "",
        email: session.user.email || "",
        // Add other fields as needed
      };
    }
  } catch (error) {
    console.log("Error getting session:", error);
    user = undefined;
  }

  return (
    <>
      <Header user={user} />
      <main className="min-h-[calc(100vh-120px)]">{children}</main>
    </>
  );
}
