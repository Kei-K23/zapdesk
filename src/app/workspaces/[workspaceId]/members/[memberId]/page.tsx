import useMemberId from "@/features/members/hooks/use-member-id";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id";

export default function MemberIdPage() {
  const workspaceId = useWorkspaceId();
  const memberId = useMemberId();
  return <div></div>;
}
