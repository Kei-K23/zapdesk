import { cn } from "@/lib/utils";
import { Leaf, ShieldAlert, ShieldIcon } from "lucide-react";
import Hint from "./hint";

interface RoleIndicatorProps {
  role: "admin" | "member" | "moderator";
  className?: string;
}

export default function RoleIndicator({ role, className }: RoleIndicatorProps) {
  switch (role) {
    case "admin":
      return (
        <Hint label="Admin">
          <ShieldAlert
            className={cn("ml-0.5 size-4 text-red-500", className)}
          />
        </Hint>
      );

    case "moderator":
      return (
        <Hint label="Moderator">
          <ShieldIcon
            className={cn("ml-0.5 size-4 text-blue-500", className)}
          />
        </Hint>
      );
    case "member":
      return (
        <Hint label="Member">
          <Leaf className={cn("ml-0.5 size-4 text-emerald-500", className)} />
        </Hint>
      );
    default:
      return null;
  }
}
