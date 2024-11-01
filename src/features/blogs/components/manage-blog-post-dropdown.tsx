import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pen, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Id } from "../../../../convex/_generated/dataModel";

interface ManageBlogPostDropdownProps {
  id?: Id<"blogs">;
}

export default function ManageBlogPostDropdown({
  id,
}: ManageBlogPostDropdownProps) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"} size={"icon"}>
          <MoreHorizontal className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => router.replace(`/blogs/${id}/edit`)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Pen className="size-4" />
          <p className="font-semibold">Edit</p>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer bg-destructive focus:bg-destructive/90">
          <Trash2 className="size-4" />
          <p className="font-semibold">Delete</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
