"use client";

import { Loader2, Plus } from "lucide-react";
import { useGetBlogs } from "../query/use-get-blogs";
import BlogPostCard from "./blog-post-card";
import { Button } from "@/components/ui/button";
import Hint from "@/components/hint";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import { Input } from "@/components/ui/input";
import { debounce } from "@/lib/debounce";
import { useCallback, ChangeEvent, useState } from "react";

export default function BlogPostScreen() {
  const [searchQuery, setSearchQuery] = useQueryState("search", parseAsString);
  const [fullSearch, setFullSearch] = useState("");

  const { data: blogsData, isLoading: blogsDataLoading } = useGetBlogs(
    fullSearch ?? ""
  );

  const router = useRouter();

  // Create the debounced version of the search function
  const handleSearch = useCallback(
    debounce((query: string) => {
      setFullSearch(query);
    }, 500),
    []
  );

  // Update the input value and trigger the debounced search
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleSearch(e.target.value);
    setSearchQuery(e.target.value);
  };

  return (
    <div className="pt-8">
      <div className="flex items-center justify-center w-[450px] mx-auto">
        <Input
          value={searchQuery ?? ""}
          onChange={handleChange} // Using handleChange here
          placeholder="Search"
          className="w-full shadow-md shadow-indigo-500/50"
        />
      </div>
      {blogsDataLoading ? (
        <div className="w-full h-full mt-10 flex items-center justify-center">
          <Loader2 className="size-10 text-muted-foreground animate-spin" />
        </div>
      ) : blogsData?.length ? (
        <div className="p-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
          {blogsData?.map((data) => (
            <BlogPostCard
              key={data.blog._id}
              blog={data.blog}
              user={data.user}
              likes={data.likes}
              commentsLength={data.commentsLength}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center mt-10 text-3xl w-full text-muted-foreground">
          <p className="text-center mx-auto">No blogs found</p>
        </div>
      )}
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
