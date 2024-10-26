import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) return null;

    // Get current user
    return await ctx.db.get(userId);
  },
});

export const getUserById = query({
  args: {
    id: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) return null;

    return await ctx.db.get(args.id);
  },
});

export const updateUser = mutation({
  args: {
    id: v.id("users"),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    isPublishEmail: v.optional(v.boolean()),
    bio: v.optional(v.string()),
    role: v.optional(v.string()),
    githubLink: v.optional(v.string()),
    personalLink: v.optional(v.string()),
    twitterLink: v.optional(v.string()),
    youTubeLink: v.optional(v.string()),
    igLink: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, {
      name: args.name,
      image: args.image,
      isPublishEmail: args.isPublishEmail,
      bio: args.bio,
      role: args.role,
      githubLink: args.githubLink,
      personalLink: args.personalLink,
      twitterLink: args.twitterLink,
      youTubeLink: args.youTubeLink,
      igLink: args.igLink,
      phone: args.phone,
    });

    return args.id;
  },
});
