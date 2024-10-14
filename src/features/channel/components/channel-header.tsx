import { Button } from "@/components/ui/button";
import { FaChevronDown } from "react-icons/fa";

interface ChannelHeaderProps {
  name: string;
}

export default function ChannelHeader({ name }: ChannelHeaderProps) {
  return (
    <div className="bg-neutral-700/50 border-b border-b-neutral-600 shadow-md px-6 py-3 flex items-center justify-between">
      <Button
        variant={"transp"}
        size={"sm"}
        className="text-[16px] font-semibold flex items-center gap-1"
      >
        # {name}
        <FaChevronDown className="size-4" />
      </Button>
      <div className="flex-1" />
    </div>
  );
}
