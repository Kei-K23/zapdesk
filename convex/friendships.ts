import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "./_generated/dataModel";

const populateUser = async (ctx: QueryCtx, id: Id<"users">) => {
  return await ctx.db.get(id);
};

export const getFollowers = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    const users: Doc<"users">[] = [];

    // Query all users that are following the specified user
    const followers = await ctx.db
      .query("friendships")
      .withIndex("by_following_id", (q) => q.eq("followingId", args.userId))
      .collect();

    for (const follower of followers) {
      const user = await populateUser(ctx, follower.followerId);
      if (user) {
        users.push(user);
      }
    }

    return users;
  },
});

export const getFollowings = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    // Query all users that the specified user is following
    const followings = await ctx.db
      .query("friendships")
      .withIndex("by_follower_id", (q) => q.eq("followerId", args.userId))
      .collect();

    const users: Doc<"users">[] = [];

    for (const following of followings) {
      const user = await populateUser(ctx, following.followingId);
      if (user) {
        users.push(user);
      }
    }

    return users;
  },
});

export const getRelationship = query({
  args: {
    userOneId: v.id("users"), // The user who is following
    userTwoId: v.id("users"), // The user who is being followed
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    const existingRelationship = await ctx.db
      .query("friendships")
      .withIndex("by_follower_id_following_id", (q) =>
        q.eq("followerId", args.userOneId).eq("followingId", args.userTwoId)
      )
      .unique();

    return existingRelationship || null;
  },
});

export const create = mutation({
  args: {
    userOneId: v.id("users"), // The user who is following
    userTwoId: v.id("users"), // The user being followed
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Check if already following
    const existingRelationship = await ctx.db
      .query("friendships")
      .withIndex("by_follower_id_following_id", (q) =>
        q.eq("followerId", args.userOneId).eq("followingId", args.userTwoId)
      )
      .unique();

    if (existingRelationship) {
      throw new Error("Already following the user");
    }

    // Create the following relationship
    return await ctx.db.insert("friendships", {
      followerId: args.userOneId,
      followingId: args.userTwoId,
    });
  },
});

export const remove = mutation({
  args: {
    userOneId: v.id("users"), // The user who is following
    userTwoId: v.id("users"), // The user being followed
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Check if the relationship exists
    const existingRelationship = await ctx.db
      .query("friendships")
      .withIndex("by_follower_id_following_id", (q) =>
        q.eq("followerId", args.userOneId).eq("followingId", args.userTwoId)
      )
      .unique();

    if (!existingRelationship) {
      throw new Error("Not following the user");
    }

    // Remove the relationship
    await ctx.db.delete(existingRelationship._id);
  },
});
