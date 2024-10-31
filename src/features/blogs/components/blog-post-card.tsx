import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronRightIcon } from "lucide-react";
import { Doc } from "../../../../convex/_generated/dataModel";

interface BlogPostCardProps {
  blog: Doc<"blogs">;
  user: {
    name?: string;
    email?: string;
    image?: string;
  };
}

export default function BlogPostCard({ blog, user }: BlogPostCardProps) {
  const [formattedDate, setFormattedDate] = useState<string>("");
  const fallbackAvatar = user?.name?.charAt(0).toUpperCase();

  useEffect(() => {
    if (blog.updatedAt) {
      const date = new Date(blog.updatedAt);
      setFormattedDate(
        date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    }
  }, [blog.updatedAt]);

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="p-0">
        {blog.image && (
          <div className="relative h-48 w-full">
            <Image
              src={blog.image}
              alt={blog.title}
              layout="fill"
              objectFit="cover"
              className="transition-transform hover:scale-105"
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="mb-2 line-clamp-2">{blog.title}</CardTitle>
        <p className="mb-4 text-sm text-muted-foreground line-clamp-3">
          {blog.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="size-8">
              <AvatarImage src={user.image} />
              <AvatarFallback className="text-white rounded-md text-[17px] bg-indigo-600 font-bold">
                {fallbackAvatar}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-bold">{user.name}</span>
          </div>
          {blog.updatedAt && (
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarIcon className="mr-1 h-4 w-4" />
              {formattedDate}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild variant="ghost" className="w-full">
          <Link href={`/blogs/${blog._id}`}>
            Read More <ChevronRightIcon className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
