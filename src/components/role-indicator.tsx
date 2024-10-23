import { cn } from "@/lib/utils";
import { ShieldAlert, ShieldIcon } from "lucide-react";
import { PiMemberOf } from "react-icons/pi";
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
          <ShieldAlert className={cn("size-4 text-red-500", className)} />
        </Hint>
      );

    case "moderator":
      return (
        <Hint label="Moderator">
          <ShieldIcon className={cn("size-4 text-blue-500", className)} />
        </Hint>
      );
    case "moderator":
      return (
        <Hint label="Member">
          <PiMemberOf className={cn("size-4", className)} />
        </Hint>
      );
    default:
      return null;
  }
}
