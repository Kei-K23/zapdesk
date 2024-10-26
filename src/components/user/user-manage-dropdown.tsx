import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useDeleteMember from "@/features/workspaces/mutation/use-delete-member";
import useUpdateMember from "@/features/workspaces/mutation/use-update-member";
import useConfirm from "@/hooks/use-confirm";
import { DoorOpen, Gavel, User } from "lucide-react";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface UserManageDropdownProps {
  children: React.ReactNode;
  authorId: Id<"members">;
  authorUserId: Id<"users">;
  authorRole: "admin" | "member" | "moderator" | undefined;
  currentAuthMember?: Doc<"members">;
}

export default function UserManageDropdown({
  children,
  authorId,
  authorUserId,
  authorRole,
  currentAuthMember,
}: UserManageDropdownProps) {
  const { toast } = useToast();
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [LeaveMemberConfirmDialog, leaveMemberConfirm] = useConfirm(
    "Are your sure?",
    "You are leaving the workspace. This process cannot be undo."
  );
  const [KickMemberConfirmDialog, kickMemberConfirm] = useConfirm(
    "Are your sure?",
    "You are removing this user form the workspace. This process cannot be undo."
  );
  const {
    mutate: deleteMemberMutation,
    isPending: deleteMemberMutationLoading,
  } = useDeleteMember();
  const {
    mutate: updateMemberMutation,
    isPending: updateMemberMutationLoading,
  } = useUpdateMember();

  const isPending = updateMemberMutationLoading || deleteMemberMutationLoading;
  const isCurrentMemberIsSelf = currentAuthMember?._id === authorId;

  const handleKickMember = async () => {
    const ok = await kickMemberConfirm();
    if (!ok) return;

    if (currentAuthMember?.role !== "admin") {
      return;
    }

    deleteMemberMutation(
      {
        workspaceId,
        memberId: authorId,
      },
      {
        onSuccess: () => {
          toast({ title: "Member was kicked from this workspace" });
          // Redirect to workspace
          router.replace("/workspaces");
        },
        onError: () => {
          toast({ title: "Error when kicking the member from the workspace" });
        },
      }
    );
  };

  const handleLeaveMember = async () => {
    const ok = await leaveMemberConfirm();
    if (!ok) return;

    if (!currentAuthMember || currentAuthMember?.role === "admin") {
      return;
    }

    deleteMemberMutation(
      {
        workspaceId,
        memberId: currentAuthMember._id,
      },
      {
        onSuccess: () => {
          toast({ title: "Successfully left the workspace" });
          // Redirect to workspace
          router.replace("/workspaces");
        },
        onError: () => {
          toast({
            title: "Error when leaving the workspace",
          });
        },
      }
    );
  };

  return (
    <>
      <LeaveMemberConfirmDialog />
      <KickMemberConfirmDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent side="right">
          <DropdownMenuItem
            disabled={isPending}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.replace(`/profile/${authorUserId}`)}
          >
            <User className="size-4" />
            <p className="font-semibold">View Full Profile</p>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {currentAuthMember?.role !== "member" &&
          currentAuthMember?._id !== authorId &&
          authorRole === "member" ? (
            <>
              <DropdownMenuItem
                disabled={isPending}
                className="flex items-center gap-2 cursor-pointer bg-destructive focus:bg-destructive/90"
                onClick={handleKickMember}
              >
                <Gavel className="size-4" />
                <p className="font-semibold">Kick</p>
              </DropdownMenuItem>
            </>
          ) : (
            authorRole !== "admin" &&
            isCurrentMemberIsSelf && (
              <DropdownMenuItem
                disabled={isPending}
                className="flex items-center gap-2 cursor-pointer bg-destructive focus:bg-destructive/90"
                onClick={handleLeaveMember}
              >
                <DoorOpen className="size-4" />
                <p className="font-semibold">Leave</p>
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
