"use client";

import { Loader2 } from "lucide-react";
import { useGetBlogs } from "../query/use-get-blogs";

export default function BlogPostScreen() {
  const { data: blogsData, isLoading: blogsDataLoading } = useGetBlogs();

  if (blogsDataLoading) {
    <div className="flex items-center justify-center">
      <Loader2 className="size-10 animate-spin" />
    </div>;
  }

  return (
    <div>
      {blogsData?.map((blog) => <div key={blog._id}>{blog.title}</div>)}
    </div>
  );
}
