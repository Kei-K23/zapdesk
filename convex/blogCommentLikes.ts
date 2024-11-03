import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getCommentLikes = query({
  args: {
    blogId: v.id("blogs"),
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return [];
    }

    const blogCommentLikes = await ctx.db
      .query("blogCommentLikes")
      .withIndex("by_blog_comment_id", (q) =>
        q.eq("blogId", args.blogId).eq("commentId", args.commentId)
      )
      .collect();

    return blogCommentLikes ?? [];
  },
});

export const getBlogCommentLikeByBlogAndUserId = query({
  args: {
    blogId: v.id("blogs"),
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    const blogCommentLike = await ctx.db
      .query("blogCommentLikes")
      .withIndex("by_blog_comment_id_user_id", (q) =>
        q
          .eq("blogId", args.blogId)
          .eq("commentId", args.commentId)
          .eq("userId", userId)
      )
      .unique();

    return blogCommentLike ?? null;
  },
});

export const createBlogCommentLike = mutation({
  args: {
    blogId: v.id("blogs"),
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    return await ctx.db.insert("blogCommentLikes", {
      userId: userId,
      blogId: args.blogId,
      commentId: args.commentId,
    });
  },
});

export const deleteBlogCommentLike = mutation({
  args: {
    id: v.id("blogCommentLikes"),
    blogId: v.id("blogs"),
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const existingBlogCommentLike = await ctx.db
      .query("blogCommentLikes")
      .withIndex("by_blog_comment_id_user_id", (q) =>
        q
          .eq("blogId", args.blogId)
          .eq("commentId", args.commentId)
          .eq("userId", userId)
      )
      .unique();

    if (!existingBlogCommentLike) {
      throw new Error("Blog comment not found");
    }

    if (existingBlogCommentLike.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);

    return args.id;
  },
});
