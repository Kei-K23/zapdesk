import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

const populateUser = async (ctx: QueryCtx, userId: Id<"users">) => {
  return await ctx.db.get(userId);
};

// Create a new comment
export const createComment = mutation({
  args: {
    body: v.string(),
    image: v.optional(v.id("_storage")),
    blogId: v.id("blogs"),
    parentCommentId: v.optional(v.id("comments")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const newComment = {
      body: args.body,
      image: args.image,
      userId,
      blogId: args.blogId,
      parentCommentId: args.parentCommentId,
    };

    return await ctx.db.insert("comments", newComment);
  },
});

// Update the comment
export const updateComment = mutation({
  args: {
    id: v.id("comments"),
    body: v.string(),
    image: v.optional(v.id("_storage")),
    blogId: v.id("blogs"),
    parentCommentId: v.optional(v.id("comments")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const updatedComment = {
      body: args.body,
      image: args.image,
      userId,
      blogId: args.blogId,
      parentCommentId: args.parentCommentId,
      updatedAt: Date.now(),
    };

    await ctx.db.patch(args.id, updatedComment);

    return args.id;
  },
});

// Delete a comment by comment ID
export const deleteComment = mutation({
  args: {
    id: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const comment = await ctx.db.get(args.id);
    if (!comment || comment.userId !== userId) {
      throw new Error(
        "Cannot delete comment: Not authorized or comment not found"
      );
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Get all comments for a specific blog by blog ID
export const getCommentsByBlogId = query({
  args: {
    blogId: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const finalData = [];

    const comments = await ctx.db
      .query("comments")
      .withIndex("by_blog_id", (q) => q.eq("blogId", args.blogId))
      .order("desc")
      .collect();

    for (const comment of comments) {
      const author = await populateUser(ctx, comment.userId);
      const image = comment.image
        ? await ctx.storage.getUrl(comment.image)
        : undefined;

      finalData.push({
        comment: {
          ...comment,
          image,
        },
        author,
      });
    }

    return finalData;
  },
});
