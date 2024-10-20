import React from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { AlertTriangleIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MemberProfilePanelHeader from "./member-profile-panel-header";
import { useGetMember } from "@/features/conversations/query/use-get-member";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { MdEmail } from "react-icons/md";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetCurrentMember from "../query/use-get-current-member";
import useWorkspaceId from "../hooks/use-workspace-id";
import useUpdateMember from "../mutation/use-update-member";
import useDeleteMember from "../mutation/use-delete-member";

interface MemberProfilePanelProps {
  memberId: Id<"members">;
  onClose: () => void;
}

export default function MemberProfilePanel({
  memberId,
  onClose,
}: MemberProfilePanelProps) {
  const workspaceId = useWorkspaceId();
  const { toast } = useToast();
  const { data: memberData, isLoading: memberDataLoading } =
    useGetMember(memberId);

  const { data: currentMember, isLoading: currentMemberLoading } =
    useGetCurrentMember({ workspaceId });
  console.log({ currentMember, memberData });

  const {
    mutate: updateMemberMutation,
    isPending: updateMemberMutationLoading,
  } = useUpdateMember();
  const {
    mutate: deleteMemberMutation,
    isPending: deleteMemberMutationLoading,
  } = useDeleteMember();

  const fallbackAvatar = memberData?.user?.name?.charAt(0).toUpperCase();
  const isPending = updateMemberMutationLoading;

  const handleRoleUpdate = (value: "member" | "admin" | "moderator") => {
    if (!memberData || !memberData.member) {
      return;
    }

    updateMemberMutation(
      {
        workspaceId,
        role: value,
        memberId: memberData.member._id,
      },
      {
        onSuccess: () => {
          toast({ title: "Member role updated successfully" });
        },
        onError: () => {
          toast({ title: "Error when updating member role" });
        },
      }
    );
  };
  const handleKickMember = () => {
    if (!memberData || !memberData.member) {
      return;
    }

    updateMemberMutation(
      {
        workspaceId,
        role: value,
        memberId: memberData.member._id,
      },
      {
        onSuccess: () => {
          toast({ title: "Member role updated successfully" });
        },
        onError: () => {
          toast({ title: "Error when updating member role" });
        },
      }
    );
  };

  if (memberDataLoading || currentMemberLoading) {
    return (
      <div className="flex-1 h-full flex flex-col justify-center items-center">
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
        <span>Loading the user profile data</span>
      </div>
    );
  }

  if (!memberData || !currentMember) {
    return (
      <div className="flex-1 h-full flex flex-col justify-center items-center">
        <AlertTriangleIcon className="size-4 text-muted-foreground" />
        <span>No member data found</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <MemberProfilePanelHeader onClose={onClose} />
      <div className="flex items-center justify-center mt-8 mb-4">
        <Avatar className="size-36 hover:opacity-75 transition-all mr-2 rounded-md">
          <AvatarImage
            src={memberData?.user?.image}
            alt={memberData?.user?.name}
          />
          <AvatarFallback className="text-white rounded-md text-[16px] bg-indigo-600 font-bold">
            {fallbackAvatar}
          </AvatarFallback>
        </Avatar>
      </div>
      <h2 className="px-4 font-bold text-lg md:text-xl">
        {memberData?.user?.name}
      </h2>
      <div className="px-4 flex items-center gap-x-4 mt-4">
        {currentMember.role === "admin" &&
        currentMember._id !== memberData.member._id ? (
          <>
            <Select
              defaultValue={memberData.member?.role}
              onValueChange={handleRoleUpdate}
              disabled={isPending}
            >
              <SelectTrigger className="border" disabled={isPending}>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Button disabled={isPending}>Kick</Button>
          </>
        ) : (
          memberData.member.role !== "admin" &&
          currentMember._id === memberData.member._id && (
            <Button disabled={isPending} className="w-full">
              Leave this workspace
            </Button>
          )
        )}
      </div>
      <Separator className="w-full bg-neutral-500 my-4" />
      <div className="px-4">
        <p className="font-semibold mb-4">Contact information</p>
        <div className="flex gap-x-3 items-center">
          <Button size={"icon"} variant={"transparent"}>
            <MdEmail className="size-7" />
          </Button>
          <div className="flex flex-col">
            <span className="text-sm">Email address</span>
            <Link
              href={`mailto:${memberData?.user?.email}`}
              className="text-sky-500"
            >
              {memberData?.user?.email}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
