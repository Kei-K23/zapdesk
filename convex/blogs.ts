import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getBlogs = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return [];
    }

    const blogs = await ctx.db.query("blogs").collect();

    if (!blogs) {
      return [];
    }

    return blogs;
  },
});

export const getBlogById = query({
  args: {
    id: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    return await ctx.db.get(args.id);
  },
});

export const createBlog = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    userId: v.id("users"),
    image: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    return await ctx.db.insert("blogs", {
      title: args.title.trim(),
      content: args.content.trim(),
      userId: args.userId,
      image: args.image,
    });
  },
});

export const deleteChannel = mutation({
  args: {
    id: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);

    return args.id;
  },
});

export const updateChannel = mutation({
  args: {
    id: v.id("blogs"),
    title: v.string(),
    content: v.string(),
    userId: v.id("users"),
    image: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, {
      title: args.title.trim(),
      content: args.content.trim(),
      userId: args.userId,
      image: args.image,
    });

    return args.id;
  },
});
