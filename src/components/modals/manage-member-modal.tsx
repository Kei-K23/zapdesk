import { useManageMemberModalStore } from "@/features/workspaces/store/manage-member-modal-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import useConfirm from "@/hooks/use-confirm";
import { useToast } from "@/hooks/use-toast";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id";
import useUpdateMember from "@/features/workspaces/mutation/use-update-member";
import { Label } from "../ui/label";

export default function ManageMemberModal() {
  const workspaceId = useWorkspaceId();
  const { toast } = useToast();
  const [RoleUpdateConfirmDialog, roleUpdateConfirm] = useConfirm(
    "Are your sure?",
    "You are about to change the role of the member."
  );
  const [manageModalStore, setManageModalStore] = useManageMemberModalStore();

  const {
    mutate: updateMemberMutation,
    isPending: updateMemberMutationLoading,
  } = useUpdateMember();

  const handleRoleUpdate = async (value: "member" | "admin" | "moderator") => {
    const ok = await roleUpdateConfirm();
    if (!ok) return;

    if (!manageModalStore.memberId || !manageModalStore.role) {
      return;
    }

    updateMemberMutation(
      {
        workspaceId,
        role: value,
        memberId: manageModalStore.memberId,
      },
      {
        onSuccess: () => {
          toast({ title: "Member role updated successfully" });
          setManageModalStore({
            open: false,
            memberId: null,
            role: undefined,
            currentAuthMemberRole: undefined,
          });
        },
        onError: (e) => {
          console.log(e);

          toast({ title: "Error when updating member role" });
        },
      }
    );
  };

  const isPending = updateMemberMutationLoading;

  return (
    <>
      <RoleUpdateConfirmDialog />
      <Dialog
        open={manageModalStore?.open}
        onOpenChange={(e) => {
          setManageModalStore({
            ...manageModalStore,
            open: e,
          });
        }}
      >
        <DialogContent className="bg-black">
          <DialogHeader>
            <DialogTitle>Manage Member</DialogTitle>
          </DialogHeader>
          <div>
            <Label htmlFor="role">Mange Member Role</Label>
            <Select
              defaultValue={manageModalStore.role}
              onValueChange={handleRoleUpdate}
              disabled={isPending}
            >
              <SelectTrigger id="role" className="border" disabled={isPending}>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                {manageModalStore.currentAuthMemberRole === "admin" && (
                  <SelectItem value="admin">Admin</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
