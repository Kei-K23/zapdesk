"use client";

import { Loader2 } from "lucide-react";
import { useGetBlogs } from "../query/use-get-blogs";
import BlogPostCard from "./blog-post-card";

export default function BlogPostScreen() {
  const { data: blogsData, isLoading: blogsDataLoading } = useGetBlogs();

  if (blogsDataLoading) {
    <div className="flex items-center justify-center">
      <Loader2 className="size-10 animate-spin" />
    </div>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {blogsData?.map((data) => (
        <BlogPostCard key={data.blog._id} blog={data.blog} user={data.user} />
      ))}
    </div>
  );
}
