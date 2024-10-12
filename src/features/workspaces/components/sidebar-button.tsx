import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import React from "react";
import { IconType } from "react-icons/lib";

type SidebarButtonProps = {
  icon: LucideIcon | IconType;
  label: string;
  isActive?: boolean;
};

export default function SidebarButton({
  icon: Icon,
  label,
  isActive,
}: SidebarButtonProps) {
  return (
    <div className="flex flex-col items-center justify-center group">
      <Button
        size={"sm"}
        className={cn(
          "font-bold h-10 mb-1 transition-all bg-transparent hover:bg-neutral-400/25",
          isActive && "bg-neutral-400/25"
        )}
      >
        <Icon className="size-6 text-white" />
      </Button>
      <span className="text-neutral-100 text-sm">{label}</span>
    </div>
  );
}
