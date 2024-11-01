import React from "react";
import { BlogPostEditor } from "./editor/blog-post-editor";
import { Id } from "../../../../convex/_generated/dataModel";
import { useGetBlog } from "../query/use-get-blog";

interface BlogPostEditScreenProps {
  id: Id<"blogs">;
}

export default function BlogPostEditScreen({ id }: BlogPostEditScreenProps) {
  const { data: blogData, isLoading: blogDataLoading } = useGetBlog(id);

  return (
    <div>
      <BlogPostEditor blog={blogData} isPending={blogDataLoading} />
    </div>
  );
}
