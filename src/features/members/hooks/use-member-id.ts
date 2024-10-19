import { useParams } from "next/navigation";
import { Id } from "../../../../convex/_generated/dataModel";

export default function useMemberId() {
  const params = useParams<{ memberId: string }>();
  return params.memberId as Id<"members">;
}
