"use client";

import { ReactNode } from "react";
import { LiveblocksProvider } from "@liveblocks/react/suspense";

export function MyRoomProvider({ children }: { children: ReactNode }) {
  return (
    <LiveblocksProvider throttle={16} authEndpoint={"/api/liveblocks-auth"}>
      {children}
    </LiveblocksProvider>
  );
}
