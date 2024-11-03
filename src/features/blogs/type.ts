import { Id } from "../../../convex/_generated/dataModel";

export type BlogType = {
  image: string | null | undefined;
  _id: Id<"blogs">;
  _creationTime: number;
  updatedAt?: number | undefined;
  userId: Id<"users">;
  title: string;
  description: string;
  content: string;
  imageSecret: Id<"_storage"> | undefined;
};

export type CreateNewBlogCommentType = {
  image?: Id<"_storage">;
  parentCommentId?: Id<"comments">;
  body: string;
  updatedAt?: number;
  blogId: Id<"blogs">;
};
