import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import useGetCurrentMember from "@/features/workspaces/query/use-get-current-member";
import { cn } from "@/lib/utils";

interface ReactionsProps {
  data: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  onChange: (value: string) => void;
}

export default function Reactions({ data, onChange }: ReactionsProps) {
  const workspaceId = useWorkspaceId();

  const { data: currentMember } = useGetCurrentMember({ workspaceId });

  const currentMemberId = currentMember?._id;

  if (!data.length || !currentMember || !currentMemberId) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 my-1">
      {data.map((reaction) => (
        <button
          key={reaction._id}
          onClick={() => onChange(reaction.value)}
          className={cn(
            "px-2 bg-neutral-700 border border-neutral-600 rounded-xl flex items-center",
            reaction.memberIds.includes(currentMemberId) &&
              "bg-indigo-500/50 border-indigo-500"
          )}
        >
          {reaction.value}
          <span className={cn("ml-1 text-xs font-bold")}>{reaction.count}</span>
        </button>
      ))}
    </div>
  );
}
