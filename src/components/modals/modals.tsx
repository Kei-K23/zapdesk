"use client";

import { useEffect, useState } from "react";
import CreateWorkspaceModal from "./create-workspace-modal";
import CreateChannelModal from "./create-channel-modal";

export default function Modals() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <CreateWorkspaceModal />
      <CreateChannelModal />
    </>
  );
}
