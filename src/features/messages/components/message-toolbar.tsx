import EmojiProvider from "@/components/emoji-provider";
import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import { MessageSquareText, Pencil, Smile, Trash2 } from "lucide-react";

interface MessageToolbarProps {
  isAuthor: boolean;
  isPending: boolean;
  isHideThreadButton?: boolean;
  handleEdit: () => void;
  handleDelete: () => void;
  handleThread: () => void;
  handleReactions: (value: string) => void;
}

export default function MessageToolbar({
  isAuthor,
  isPending,
  isHideThreadButton,
  handleDelete,
  handleEdit,
  handleReactions,
  handleThread,
}: MessageToolbarProps) {
  return (
    <div className="absolute top-0 right-5">
      <div className="group-hover:opacity-100 opacity-0 transition-opacity border">
        <EmojiProvider
          hint="Add reaction"
          onEmojiSelect={(e) => handleReactions(e.native)}
        >
          <Button variant={"ghost"} size={"iconSm"} disabled={isPending}>
            <Smile className="size-4" />
          </Button>
        </EmojiProvider>
        {!isHideThreadButton && (
          <Hint label="Reply in thread">
            <Button variant={"ghost"} size={"iconSm"} disabled={isPending}>
              <MessageSquareText className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <>
            <Hint label="Edit the message">
              <Button
                variant={"ghost"}
                size={"iconSm"}
                disabled={isPending}
                onClick={handleEdit}
              >
                <Pencil className="size-4" />
              </Button>
            </Hint>
            <Hint label="Delete the message">
              <Button
                variant={"ghostDestructive"}
                size={"iconSm"}
                disabled={isPending}
                onClick={handleDelete}
              >
                <Trash2 className="size-4" />
              </Button>
            </Hint>
          </>
        )}
      </div>
    </div>
  );
}
