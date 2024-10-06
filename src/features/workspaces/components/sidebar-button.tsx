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
          "font-bold h-10 mb-1 transition-all bg-transparent group-hover:bg-accent/25",
          isActive && "bg-accent/25"
        )}
      >
        <Icon className="size-6" />
      </Button>
      <span className="text-white text-sm">{label}</span>
    </div>
  );
}
