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
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ManageBlogPostDropdown from "./manage-blog-post-dropdown";

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
        <div className="fixed top-10 left-80">
          <Hint label="Back">
            <Button variant={"ghost"} onClick={() => router.replace("/blogs")}>
              <ArrowBigLeftDashIcon className="size-6 text-muted-foreground" />
            </Button>
          </Hint>
        </div>
        {blogData?.blog.image && (
          <>
            <Dialog>
              <DialogTrigger asChild>
                <div className="relative h-52 w-full my-6 overflow-hidden cursor-zoom-in">
                  <Image
                    src={blogData?.blog.image}
                    alt={blogData?.blog.title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-[800px] h-[500px] p-0 overflow-hidden">
                <Image
                  src={blogData?.blog.image}
                  alt={blogData?.blog.title}
                  layout="fill"
                  objectFit="cover"
                />
              </DialogContent>
            </Dialog>
          </>
        )}
        <h2 className="font-bold text-2xl">{blogData?.blog?.title}</h2>
        <p className="text-muted-foreground">{blogData?.blog?.description}</p>
        <div className="flex items-center justify-between gap-x-6">
          <div className="flex items-center space-x-2 my-4">
            <Avatar className="size-12">
              <AvatarImage src={blogData?.user?.image} />
              <AvatarFallback className="text-white rounded-md text-[17px] bg-indigo-600 font-bold">
                {fallbackAvatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-[16px] font-bold">
                {blogData?.user?.name}
              </span>
              <span className="text-sm text-muted-foreground">
                {blogData?.user?.role}
              </span>
            </div>
          </div>
          <ManageBlogPostDropdown />
        </div>
        <div className="mb-5 mt-8">
          <ContentDisplay content={JSON.parse(blogData?.blog?.content!)} />
        </div>
      </div>
    </div>
  );
}
