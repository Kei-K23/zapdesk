"use client";

import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";

export default function Home() {
  const { signOut } = useAuthActions();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Home page
      <Button
        onClick={() => {
          signOut();
        }}
      >
        Sign out
      </Button>
    </main>
  );
}
