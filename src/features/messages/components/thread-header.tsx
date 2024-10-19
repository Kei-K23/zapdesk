import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import React from "react";

interface ThreadHeaderProps {
  onClose: () => void;
}

export default function ThreadHeader({ onClose }: ThreadHeaderProps) {
  return (
    <div className="bg-neutral-700/50 border-b border-b-neutral-600 shadow-md px-6 py-1.5 h-[50px] flex items-center justify-between">
      <h3 className="font-bold">Thread</h3>
      <Hint label="Close thread">
        <Button size={"iconSm"} variant={"ghost"} onClick={onClose}>
          <X className="size-5" />
        </Button>
      </Hint>
    </div>
  );
}
