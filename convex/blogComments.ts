import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

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
      updatedAt: Date.now(),
    };

    return await ctx.db.insert("comments", newComment);
  },
});

// Delete a comment by comment ID
export const deleteComment = mutation({
  args: {
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const comment = await ctx.db.get(args.commentId);
    if (!comment || comment.userId !== userId) {
      throw new Error(
        "Cannot delete comment: Not authorized or comment not found"
      );
    }

    await ctx.db.delete(args.commentId);
    return args.commentId;
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

    return await ctx.db
      .query("comments")
      .withIndex("by_blog_id", (q) => q.eq("blogId", args.blogId))
      .order("desc")
      .collect();
  },
});
