import { v } from "convex/values";
import { query } from "./_generated/server";
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
