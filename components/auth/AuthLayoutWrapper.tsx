"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function AuthLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    // For now, we'll skip this check to fix signup
    // We'll implement proper auth check later
    setIsCheckingAuth(false);
  }, []);

  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative bg-[#EFEBDC] border-r border-[#EFEBDC] hidden lg:block">
        <Image
          src="/assets/images/auth.png"
          alt="Auth background"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 block">
            <Image
              src="/assets/icons/logo.svg"
              alt="Signalist logo"
              width={160}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
