/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Id } from "../../../../convex/_generated/dataModel";
import { useGetBlog } from "../query/use-get-blog";
import { ContentDisplay } from "./editor/content-display";
import {
  ArrowBigLeftDashIcon,
  CalendarIcon,
  Flame,
  Loader2,
  Plus,
} from "lucide-react";
import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ManageBlogPostDropdown from "./manage-blog-post-dropdown";
import { format } from "date-fns";
import { useCurrentUser } from "@/features/auth/query/use-current-user";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useGetBlogLike } from "../query/use-get-blog-like";
import { useGetBlogLikes } from "../query/use-get-blog-likes";
import useCreateBlogLike from "../mutation/use-create-blog-like";
import useDeleteBlogLike from "../mutation/use-delete-blog-like";
import { useToast } from "@/hooks/use-toast";
import Editor from "@/components/editor";
import CommentEditor from "./comment-editor";

interface BlogPostIdPageScreenProps {
  id: string;
}

export default function BlogPostIdPageScreen({
  id,
}: BlogPostIdPageScreenProps) {
  const { toast } = useToast();
  const [deleteBlogLoading, setDeleteBlogLoading] = useState(false);
  const router = useRouter();
  const { data: blogData, isLoading: blogDataLoading } = useGetBlog(
    id as Id<"blogs">
  );
  const { data: userData, isLoading: userDataLoading } = useCurrentUser();
  const fallbackAvatar = blogData?.user?.name?.charAt(0).toUpperCase();
  const {
    data: blogLikeDataForCurrentUser,
    isLoading: blogLikeDataForCurrentUserLoading,
  } = useGetBlogLike(id as Id<"blogs">);
  const { data: blogLikesData, isLoading: blogLikesDataLoading } =
    useGetBlogLikes(id as Id<"blogs">);

  const {
    mutate: createBlogLikeMutation,
    isPending: createBlogLikeMutationLoading,
  } = useCreateBlogLike();

  const {
    mutate: deleteBlogLikeMutation,
    isPending: deleteBlogLikeMutationLoading,
  } = useDeleteBlogLike();

  const isLoading =
    blogDataLoading ||
    userDataLoading ||
    deleteBlogLoading ||
    blogLikeDataForCurrentUserLoading ||
    blogLikesDataLoading;

  const isPending =
    createBlogLikeMutationLoading || deleteBlogLikeMutationLoading;

  const handelToggleLike = () => {
    if (!id) return;

    if (!!blogLikeDataForCurrentUser) {
      // Delete the blog like
      deleteBlogLikeMutation(
        {
          blogId: id as Id<"blogs">,
          id: blogLikeDataForCurrentUser._id,
        },
        {
          onError: () => {
            toast({ title: "Error when removing the like" });
          },
        }
      );
    } else {
      // Create new blog like for the current user
      createBlogLikeMutation(
        {
          blogId: id as Id<"blogs">,
        },
        {
          onError: (e) => {
            toast({ title: "Error when creating the like" });
          },
        }
      );
    }
  };

  useEffect(() => {
    if (isLoading) return;

    if (!!!blogData) {
      router.replace("/blogs");
    }
  }, []);

  if (isLoading) {
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
        <p className="text-muted-foreground my-2">
          {blogData?.blog?.description}
        </p>
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
          <div className="flex items-center justify-center gap-x-2">
            <Button
              size={"icon"}
              variant={"ghost"}
              className={cn("w-16 flex items-center")}
              disabled={isPending || isLoading}
              onClick={handelToggleLike}
            >
              <svg width="0" height="0">
                <linearGradient
                  id="flame-gradient"
                  x1="100%"
                  y1="100%"
                  x2="0%"
                  y2="0%"
                >
                  <stop stopColor="#ff0000" offset="0%" />
                  <stop stopColor="#fdcf58" offset="100%" />
                </linearGradient>
              </svg>
              <Flame
                style={{
                  stroke: !!blogLikeDataForCurrentUser
                    ? "url(#flame-gradient)"
                    : "",
                }}
              />{" "}
              {blogLikesData?.length && blogLikesData?.length > 0 ? (
                <span>{blogLikesData?.length}</span>
              ) : null}
              {!!blogLikeDataForCurrentUser && <Plus className="size-3" />}
            </Button>
            {userData?._id === blogData?.user?.id && (
              <ManageBlogPostDropdown
                id={blogData?.blog?._id}
                userId={blogData?.user?.id}
                deleteBlogLoading={deleteBlogLoading}
                setDeleteBlogLoading={setDeleteBlogLoading}
              />
            )}
          </div>
        </div>
        {blogData?.blog?._creationTime && (
          <div>
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarIcon className="mr-1 h-4 w-4" />
              <span className="truncate">
                {format(
                  new Date(blogData?.blog?._creationTime),
                  "MMMM do, yyyy"
                )}
              </span>
            </div>
            {blogData?.blog?.updatedAt && (
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarIcon className="mr-1 h-4 w-4" />
                <span className="truncate">
                  {format(new Date(blogData?.blog.updatedAt), "MMMM do, yyyy")}{" "}
                  (last updated)
                </span>
              </div>
            )}
          </div>
        )}
        <div className="mb-5 mt-8">
          <ContentDisplay content={JSON.parse(blogData?.blog?.content!)} />
        </div>
      </div>
      <CommentEditor />
    </div>
  );
}
