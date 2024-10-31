import BlogPostIdPageScreen from "@/features/blogs/components/blog-post-id-page-screen";

interface BlogIdPageProps {
  params: {
    blogId: string;
  };
}

export default function BlogIdPage({ params }: BlogIdPageProps) {
  return <BlogPostIdPageScreen id={params.blogId} />;
}
