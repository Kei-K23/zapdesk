/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client";

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
      <BlogPostEditor
        blog={blogData}
        content={JSON.parse(blogData?.blog?.content!)}
        isPending={blogDataLoading}
      />
    </div>
  );
}
