import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import React from "react";
import { IconType } from "react-icons/lib";

type SidebarButtonProps = {
  icon: LucideIcon | IconType;
  label: string;
  hintLabel: string;
  isActive?: boolean;
  handleClick?: () => void;
};

export default function SidebarButton({
  icon: Icon,
  label,
  hintLabel,
  isActive,
  handleClick,
}: SidebarButtonProps) {
  return (
    <div className="flex flex-col items-center justify-center group">
      <Hint label={hintLabel} side="right">
        <Button
          size={"sm"}
          className={cn(
            "font-bold h-10 mb-1 transition-all bg-transparent hover:bg-neutral-400/25",
            isActive && "bg-neutral-400/25"
          )}
          onClick={handleClick}
        >
          <Icon className="size-5 text-white" />
        </Button>
      </Hint>
      <span className="text-neutral-100 text-sm">{label}</span>
    </div>
  );
}
