/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Id } from "../../../../convex/_generated/dataModel";
import { useGetBlog } from "../query/use-get-blog";
import { ContentDisplay } from "./editor/content-display";
import { ArrowBigLeftDashIcon, Loader2 } from "lucide-react";
import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface BlogPostIdPageScreenProps {
  id: string;
}

export default function BlogPostIdPageScreen({
  id,
}: BlogPostIdPageScreenProps) {
  const router = useRouter();
  const { data: blogData, isLoading: blogDataLoading } = useGetBlog(
    id as Id<"blogs">
  );
  const fallbackAvatar = blogData?.user?.name?.charAt(0).toUpperCase();

  if (blogDataLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="size-6 text-muted-foreground animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="w-full max-w-3xl mx-auto">
        <div className="fixed top-4 left-80">
          <Hint label="Back">
            <Button variant={"ghost"} onClick={() => router.replace("/blogs")}>
              <ArrowBigLeftDashIcon className="size-6 text-muted-foreground" />
            </Button>
          </Hint>
        </div>
        <h2>{blogData?.blog?.title}</h2>
        <p>{blogData?.blog?.description}</p>
        <div className="flex items-center space-x-2">
          <Avatar className="size-8">
            <AvatarImage src={blogData?.user?.image} />
            <AvatarFallback className="text-white rounded-md text-[17px] bg-indigo-600 font-bold">
              {fallbackAvatar}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-bold">{blogData?.user?.name}</span>
        </div>
        <ContentDisplay content={JSON.parse(blogData?.blog?.content!)} />
      </div>
    </div>
  );
}
