import { Loader2 } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import { useGetBlogCommentsByBlogId } from "../query/use-get-blog-comments-by-blog-id";
import BlogCommentItem from "./blog-comment-item";
import { useState } from "react";

interface BlogCommentListsProps {
  blogId: Id<"blogs">;
  currentUserId?: Id<"users">;
}

export default function BlogCommentLists({
  blogId,
  currentUserId,
}: BlogCommentListsProps) {
  const [editingId, setEditingId] = useState<Id<"comments"> | null>(null);
  const { data: blogComments, isLoading: blogCommentsLoading } =
    useGetBlogCommentsByBlogId(blogId);

  if (blogCommentsLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="text-lg text-muted-foreground animate-spin" />
      </div>
    );
  }

  if (!!!blogComments?.length) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-center text-muted-foreground">No comments</p>
      </div>
    );
  }

  return (
    <div className="w-full  max-w-3xl mx-auto mt-6">
      <h3 className="text-lg mb-4">Comments</h3>

      <div className="mt-4">
        {blogComments.map((data) => {
          return (
            <BlogCommentItem
              key={data.comment._id}
              id={data.comment._id}
              body={data.comment.body}
              image={data.comment.image}
              userId={currentUserId!}
              authorName={data.author?.name}
              authorImage={data.author?.image}
              authorBio={data.author?.bio}
              isAuthor={data.comment?.userId === currentUserId}
              isEditing={editingId === data.comment?._id}
              updatedAt={data.comment.updatedAt}
              createdAt={data.comment._creationTime}
              setEditing={setEditingId}
            />
          );
        })}
      </div>
    </div>
  );
}
