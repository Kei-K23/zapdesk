import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query, QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

const populateUser = async (ctx: QueryCtx, id: Id<"users">) => {
  return await ctx.db.get(id);
};

export const getBlogs = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return [];
    }

    const blogs = await ctx.db.query("blogs").order("desc").collect();

    if (!blogs) {
      return [];
    }

    const finalData = [];
    for (const blog of blogs) {
      const user = await populateUser(ctx, blog.userId);
      if (user) {
        finalData.push({
          blog,
          user: {
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
          },
        });
      }
    }

    return finalData;
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
    const blog = await ctx.db.get(args.id);
    if (!blog) {
      return null;
    }

    const user = await populateUser(ctx, blog.userId);
    if (!user) {
      return null;
    }

    return {
      blog,
      user: {
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
      },
    };
  },
});

export const createBlog = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    description: v.string(),
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
      description: args.description.trim(),
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
