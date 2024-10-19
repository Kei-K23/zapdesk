import PreferencesChannelModal from "@/components/modals/preferences-channel-modal";
import { Button } from "@/components/ui/button";
import { FaChevronDown } from "react-icons/fa";
import { Doc } from "../../../../convex/_generated/dataModel";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface ChannelHeaderProps {
  channel: Doc<"channels"> | undefined | null;
  channelLoading: boolean;
}

export default function ChannelHeader({
  channel,
  channelLoading,
}: ChannelHeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <PreferencesChannelModal
        channel={channel!}
        open={open}
        channelLoading={channelLoading}
        setOpen={setOpen}
      />
      <div className="bg-neutral-700/50 border-b border-b-neutral-600 shadow-md px-6 py-2 h-[50px] flex items-center justify-between">
        {channelLoading ? (
          <>
            <Loader2 className="size-4 text-muted-foreground animate-spin" />
          </>
        ) : (
          <Button
            disabled={channelLoading}
            variant={"transp"}
            size={"sm"}
            className="text-[16px] font-semibold flex items-center gap-1"
            onClick={() => setOpen(true)}
          >
            # {channel?.name}
            <FaChevronDown className="size-4" />
          </Button>
        )}

        <div className="flex-1" />
      </div>
    </>
  );
}
