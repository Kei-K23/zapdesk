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
import useDeleteBlog from "../mutation/use-delete-blog";
import useConfirm from "@/hooks/use-confirm";
import { useToast } from "@/hooks/use-toast";

interface ManageBlogPostDropdownProps {
  id?: Id<"blogs">;
  userId?: Id<"users">;
  deleteBlogLoading: boolean;
  setDeleteBlogLoading: (value: boolean) => void;
}

export default function ManageBlogPostDropdown({
  id,
  userId,
  deleteBlogLoading,
  setDeleteBlogLoading,
}: ManageBlogPostDropdownProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are your sure?",
    "All related information with this blog post will be deleted and cannot be undo."
  );
  const { mutate: deleteBlogMutation, isPending: deleteBlogMutationLoading } =
    useDeleteBlog();

  const handelDelete = async () => {
    const ok = await confirm();

    if (!ok) return;

    if (!id || !userId) return;
    // Start the loading state for blog id page
    setDeleteBlogLoading(true);

    await deleteBlogMutation(
      {
        id,
        userId,
      },
      {
        onSuccess: () => {
          setDeleteBlogLoading(true);
          toast({ title: "Successfully deleted the blog" });
          //! TODO: Here make sure to replace with NextJS things
          window.location.replace("/blogs");
        },
        onError: () => {
          toast({ title: "Error when deleting the blo" });
        },
        onSettled: () => {
          setDeleteBlogLoading(false);
        },
      }
    );
  };

  return (
    <>
      <ConfirmDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"} size={"icon"}>
            <MoreHorizontal className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            disabled={deleteBlogLoading || deleteBlogMutationLoading}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.replace(`/blogs/${id}/edit`)}
          >
            <Pen className="size-4" />
            <p className="font-semibold">Edit</p>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={deleteBlogLoading}
            className="flex items-center gap-2 cursor-pointer bg-destructive focus:bg-destructive/90"
            onClick={handelDelete}
          >
            <Trash2 className="size-4" />
            <p className="font-semibold">Delete</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
