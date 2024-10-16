import React, { useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface EmojiProviderProps {
  children: React.ReactNode;
  hint: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEmojiSelect: (emoji: any) => void;
}

export default function EmojiProvider({
  children,
  hint,
  onEmojiSelect,
}: EmojiProviderProps) {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <TooltipProvider>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <Tooltip
          open={tooltipOpen}
          onOpenChange={setTooltipOpen}
          delayDuration={50}
        >
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Picker data={data} onEmojiSelect={onEmojiSelect} />
          </PopoverContent>
          <TooltipContent>
            <p>{hint}</p>
          </TooltipContent>
        </Tooltip>
      </Popover>
    </TooltipProvider>
  );
}
