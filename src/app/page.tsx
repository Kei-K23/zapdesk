"use client";

import UserButton from "@/features/auth/components/user-button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Home page
      <UserButton />
    </main>
  );
}
