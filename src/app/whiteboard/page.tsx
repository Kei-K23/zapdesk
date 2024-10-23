"use client";

import Whiteboard from "@/features/whiteboard/components/whiteboard";
import { MyRoomProvider } from "@/features/whiteboard/provider/room-provider";

export default function WhiteboardPage() {
  return (
    <MyRoomProvider>
      <Whiteboard roomId={"liveblocks:examples:nextjs-whiteboard-advanced"} />
    </MyRoomProvider>
  );
}
