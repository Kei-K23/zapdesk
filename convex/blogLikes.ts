import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getLikes = query({
  args: {
    blogId: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return [];
    }

    const blogLikes = await ctx.db
      .query("blogLikes")
      .withIndex("by_blog_id", (q) => q.eq("blogId", args.blogId))
      .collect();

    return blogLikes ?? [];
  },
});

export const getBlogLikeByBlogAndUserId = query({
  args: {
    blogId: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    const blogLike = await ctx.db
      .query("blogLikes")
      .withIndex("by_blog_id_user_id", (q) =>
        q.eq("blogId", args.blogId).eq("userId", userId)
      )
      .unique();

    return blogLike ?? null;
  },
});

export const createBlogLike = mutation({
  args: {
    blogId: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const existingBlogLike = await ctx.db
      .query("blogLikes")
      .withIndex("by_blog_id_user_id", (q) =>
        q.eq("blogId", args.blogId).eq("userId", userId)
      )
      .unique();

    if (existingBlogLike) {
      throw new Error("User is already liked the blog");
    }

    return await ctx.db.insert("blogLikes", {
      userId: userId,
      blogId: args.blogId,
    });
  },
});

export const deleteBlogLike = mutation({
  args: {
    id: v.id("blogLikes"),
    blogId: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const existingBlogLike = await ctx.db
      .query("blogLikes")
      .withIndex("by_blog_id_user_id", (q) =>
        q.eq("blogId", args.blogId).eq("userId", userId)
      )
      .unique();

    if (!existingBlogLike) {
      throw new Error("User is not liked the blog");
    }

    if (existingBlogLike.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);

    return args.id;
  },
});
