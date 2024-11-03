"use client";

import { Loader2, Plus } from "lucide-react";
import { useGetBlogs } from "../query/use-get-blogs";
import BlogPostCard from "./blog-post-card";
import { Button } from "@/components/ui/button";
import Hint from "@/components/hint";
import { useRouter } from "next/navigation";

export default function BlogPostScreen() {
  const { data: blogsData, isLoading: blogsDataLoading } = useGetBlogs();
  const router = useRouter();

  if (blogsDataLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="size-10 text-muted-foreground animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {blogsData?.map((data) => (
        <BlogPostCard
          key={data.blog._id}
          blog={data.blog}
          user={data.user}
          likes={data.likes}
          commentsLength={data.commentsLength}
        />
      ))}
      <Hint label="Create New Blog">
        <Button
          variant={"primary"}
          size={"lg"}
          className="rounded-full px-2.5 h-[50px] fixed bottom-6 right-6"
          onClick={() => router.replace("/blogs/create")}
        >
          <Plus className="size-8" />
        </Button>
      </Hint>
    </div>
  );
}
