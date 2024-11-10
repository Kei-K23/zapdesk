import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query, QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

const populateUser = async (ctx: QueryCtx, id: Id<"users">) => {
  return await ctx.db.get(id);
};

export const getBlogs = query({
  args: {
    searchQuery: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return [];
    }

    let blogs = [];

    if (!!args.searchQuery) {
      blogs = await ctx.db
        .query("blogs")
        .withSearchIndex("search_title", (q) =>
          q.search("title", args.searchQuery ?? "")
        )
        .collect();
    } else {
      blogs = await ctx.db.query("blogs").order("desc").collect();
    }

    if (!blogs) {
      return [];
    }

    const finalData: Array<{
      blog: {
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
      user: {
        name: string | undefined;
        email: string | undefined;
        image: string | undefined;
        role: string | undefined;
        id: Id<"users">;
      };
      likes: Doc<"blogLikes">[];
      commentsLength: number;
    }> = [];
    for (const blog of blogs) {
      const user = await populateUser(ctx, blog.userId);
      const image = blog.image
        ? await ctx.storage.getUrl(blog.image)
        : undefined;

      const blogLikes = await ctx.db
        .query("blogLikes")
        .withIndex("by_blog_id", (q) => q.eq("blogId", blog._id))
        .collect();

      const comments = await ctx.db
        .query("comments")
        .withIndex("by_blog_id", (q) => q.eq("blogId", blog._id))
        .collect();

      if (user) {
        finalData.push({
          blog: {
            ...blog,
            image,
            imageSecret: blog.image,
          },
          user: {
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
            id: user._id,
          },
          likes: blogLikes ?? [],
          commentsLength: comments.length,
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
    const image = blog.image ? await ctx.storage.getUrl(blog.image) : undefined;

    const user = await populateUser(ctx, blog.userId);
    if (!user) {
      return null;
    }

    return {
      blog: {
        ...blog,
        image,
        imageSecret: blog.image,
      },
      user: {
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        id: user._id,
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

export const deleteBlog = mutation({
  args: {
    id: v.id("blogs"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const existingBlog = await ctx.db.get(args.id);

    if (!existingBlog) {
      throw new Error("Blog not found to update");
    }

    if (existingBlog.userId !== args.userId) {
      throw new Error("Unauthorized");
    }
    // Delete the image storage
    if (existingBlog.image) {
      await ctx.storage.delete(existingBlog.image);
    }

    // TODO: Delete all related data e.g likes, comments

    // Delete the blog
    await ctx.db.delete(args.id);

    return args.id;
  },
});

export const updateBlog = mutation({
  args: {
    id: v.id("blogs"),
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

    const existingBlog = await ctx.db.get(args.id);

    if (!existingBlog) {
      throw new Error("Blog not found to update");
    }

    if (existingBlog.userId !== args.userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, {
      title: args.title.trim(),
      content: args.content.trim(),
      description: args.description.trim(),
      userId: args.userId,
      image: args.image,
      updatedAt: Date.now(),
    });

    return args.id;
  },
});
