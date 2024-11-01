import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon } from "lucide-react";
import { BlogType } from "../type";
import { format } from "date-fns";

interface BlogPostCardProps {
  blog: BlogType;
  user: {
    name?: string;
    email?: string;
    image?: string;
  };
}

export default function BlogPostCard({ blog, user }: BlogPostCardProps) {
  const fallbackAvatar = user?.name?.charAt(0).toUpperCase();

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-indigo-500/50 hover:shadow-lg flex flex-col h-full">
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
      <CardContent className="p-4 flex flex-col flex-grow">
        <CardTitle className="mb-2 line-clamp-2 h-14 overflow-hidden">
          <Link href={`/blogs/${blog._id}`} className="hover:underline text-lg">
            {blog.title}
          </Link>
        </CardTitle>
        <p className="mb-4 text-[15px] text-muted-foreground line-clamp-2 flex-grow">
          {blog.description}
        </p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-700">
          <div className="flex items-center space-x-2">
            <Avatar className="size-10">
              <AvatarImage src={user.image} />
              <AvatarFallback className="text-white rounded-md text-[17px] bg-indigo-600 font-bold">
                {fallbackAvatar}
              </AvatarFallback>
            </Avatar>
            <span className="text-[15px] font-bold truncate max-w-[100px]">
              {user.name}
            </span>
          </div>
          <div>
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarIcon className="mr-1 h-4 w-4" />
              <span className="truncate">
                {format(new Date(blog._creationTime), "MMMM do, yyyy")}
              </span>
            </div>
            {/* {blog.updatedAt && (
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarIcon className="mr-1 h-4 w-4" />
                <span className="truncate">
                  {format(new Date(blog.updatedAt), "MMMM do, yyyy")}
                </span>
              </div>
            )} */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
