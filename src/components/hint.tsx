"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type HintProps = {
  children: React.ReactNode;
  label: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "center" | "end" | "start";
};

export default function Hint({ children, label, side, align }: HintProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align}>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
