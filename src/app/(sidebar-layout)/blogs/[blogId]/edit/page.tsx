import BlogPostEditScreen from "@/features/blogs/components/blog-post-edit-screen";
import { Id } from "../../../../../../convex/_generated/dataModel";

interface BlogIdPageProps {
  params: {
    blogId: string;
  };
}

export default function BlogEditPage({ params }: BlogIdPageProps) {
  return <BlogPostEditScreen id={params.blogId as Id<"blogs">} />;
}
