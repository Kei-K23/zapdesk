"use client";

import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id";
import useGetAdminMember from "../query/use-get-admin-member";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetWorkspace } from "@/features/workspaces/query/user-get-workspace";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useCreateNewMember from "../mutation/use-create-new-member";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface JoinCodeScreenProps {
  joinCode: string;
}

export default function JoinCodeScreen({ joinCode }: JoinCodeScreenProps) {
  const { toast } = useToast();
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { data: adminData, isLoading: adminDataLoading } = useGetAdminMember({
    workspaceId,
  });
  const { data: workspaceData, isLoading: workspaceDataLoading } =
    useGetWorkspace({ id: workspaceId });
  const { mutate, isPending } = useCreateNewMember();

  const fallbackAvatar = workspaceData?.name.charAt(0).toUpperCase();

  const handleOnJoin = () => {
    mutate(
      { workspaceId, joinCode },
      {
        onSuccess: () => {
          toast({
            title:
              "Successfully joined to '" + workspaceData?.name + "' workspace",
          });

          router.replace(`/workspaces/${workspaceId}`);
        },
        onError: (e) => {
          toast({
            title: "This user is already active member of this workspace",
          });
        },
      }
    );
  };

  const isLoading = adminDataLoading || workspaceDataLoading || isPending;

  return (
    <div className="h-full flex items-center justify-center flex-col ">
      <Card className="w-[500px] shadow-lg drop-shadow-xl shadow-indigo-500/40">
        <CardContent>
          <div className="mt-5 flex items-center justify-center flex-col">
            <Avatar className="size-16 hover:opacity-75 transition-all">
              <AvatarImage src={""} alt={""} />
              <AvatarFallback className="text-white text-4xl bg-indigo-500">
                {fallbackAvatar}
              </AvatarFallback>
            </Avatar>
            <p className="mt-5 text-neutral-300">
              {adminData?.name} invited you to join
            </p>
            <span className="mt-1 text-3xl">{workspaceData?.name}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            disabled={isLoading}
            variant={"primary"}
            className="w-full text-[16px]"
            onClick={handleOnJoin}
          >
            Accept Invite
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
