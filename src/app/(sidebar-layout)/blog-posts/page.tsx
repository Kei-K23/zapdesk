import { TiptapEditor } from "@/components/blog/editor/tip-tap-editor";

export default function BlogPostPage() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container">
        <h1 className="text-4xl font-bold text-center mb-8">
          Blog Post Editor
        </h1>
        <TiptapEditor />
      </div>
    </div>
  );
}
