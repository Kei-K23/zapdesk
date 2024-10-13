import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { FaCaretDown } from "react-icons/fa";
import { useToggle } from "react-use";

interface WorkspaceSectionProps {
  children: React.ReactNode;
  label: string;
  hint: string;
  onNew?: () => void;
}

export default function WorkspaceSection({
  children,
  label,
  hint,
  onNew,
}: WorkspaceSectionProps) {
  const [on, toggle] = useToggle(true);

  return (
    <div className="flex flex-col mt-3">
      <div className="flex items-center justify-between gap-x-4">
        <div className="flex items-center gap-1">
          <Button variant={"transp"} size={"iconSm"} onClick={toggle}>
            <FaCaretDown
              className={cn("size-4 transition-all", !on && "-rotate-90")}
            />
          </Button>
          <span>{label}</span>
        </div>
        {!!onNew && (
          <Hint label={hint}>
            <Button variant={"transp"} size={"iconSm"} onClick={onNew}>
              <Plus className="size-4" />
            </Button>
          </Hint>
        )}
      </div>
      {on && <div className="px-2 transition-all">{children}</div>}
    </div>
  );
}
