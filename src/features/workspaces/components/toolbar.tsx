"use client";

import { Button } from "@/components/ui/button";
import { CircleAlert, Search } from "lucide-react";
import React, { useState } from "react";
import useWorkspaceId from "../hooks/use-workspace-id";
import { useGetWorkspace } from "../query/user-get-workspace";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useGetChannelsAndMembers } from "../query/user-get-channels-and-members";

export default function Toolbar() {
  const [open, setOpen] = useState(false);
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkspace({ id: workspaceId });
  const {
    data: channelsAndMembersData,
    isLoading: channelsAndMembersDataLoading,
  } = useGetChannelsAndMembers({ id: workspaceId });

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          disabled={channelsAndMembersDataLoading}
          placeholder={`Search channels or members of '${data?.name}' workspace...`}
          className="truncate"
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {channelsAndMembersData &&
            channelsAndMembersData.channels &&
            channelsAndMembersData.channels.length > 0 && (
              <CommandGroup heading="Channels">
                {channelsAndMembersData.channels.map((channel) => (
                  <CommandItem key={channel._id} className="truncate">
                    # {channel.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          <CommandSeparator />
          {channelsAndMembersData &&
            channelsAndMembersData.members &&
            channelsAndMembersData.members.length > 0 && (
              <CommandGroup heading="Members">
                {channelsAndMembersData.members.map((member) => (
                  <CommandItem key={member?.member?._id} className="truncate">
                    {member?.user?.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
        </CommandList>
      </CommandDialog>
      <nav className="bg-neutral-900/50 text-white flex items-center justify-between h-10 py-2 px-4 border-b border-b-neutral-800">
        {/* Placeholder element */}
        <div className="flex-1" />
        <div className="min-w-[280px] w-[620px] grow-[2] shrink">
          <Button
            disabled={channelsAndMembersDataLoading}
            size={"sm"}
            variant={"transparent"}
            className="w-full transition-all flex justify-start"
            onClick={() => setOpen(true)}
          >
            <Search className="size-4 mr-2" />
            <span className="font-bold line-clamp-1">Search {data?.name}</span>
          </Button>
        </div>
        <div className="flex-1 flex justify-end">
          <Button variant={"transp"} size={"iconSm"}>
            <CircleAlert className="size-5" />
          </Button>
        </div>
      </nav>
    </>
  );
}
