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
