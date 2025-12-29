import React from "react";
import Header from "@/components/Header";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;
  
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    user = session?.user || null;
  } catch (error) {
    console.log("Error getting session:", error);
    user = null;
  }

  return (
    <>
      <Header user={user} />
      <main className="min-h-[calc(100vh-120px)]">{children}</main>
    </>
  );
}
