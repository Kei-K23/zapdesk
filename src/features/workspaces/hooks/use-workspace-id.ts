import { useParams } from "next/navigation";
import { Id } from "../../../../convex/_generated/dataModel";

export default function useWorkspaceId() {
  const params = useParams<{ workspaceId: string }>();
  return params.workspaceId as Id<"workspaces">;
}
