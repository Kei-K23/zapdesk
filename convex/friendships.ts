import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "./_generated/dataModel";

const populateUser = async (ctx: QueryCtx, id?: Id<"users">) => {
  try {
    if (id) {
      return await ctx.db.get(id);
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    return null;
  }
};

export const getFollowers = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    try {
      const userId = await getAuthUserId(ctx);
      if (!userId) return null;

      const followers = await ctx.db
        .query("friendships")
        .withIndex("by_following_id", (q) => q.eq("followingId", args.userId))
        .collect();

      const data: Array<{
        user: Doc<"users">;
        friendships: Doc<"friendships">;
      }> = [];
      for (const follower of followers) {
        const user = await populateUser(ctx, follower.followerId);
        if (user) data.push({ user, friendships: follower });
      }

      return data;
    } catch (error) {
      console.error("Error in getFollowers:", error);
      return null;
    }
  },
});

export const getFollowings = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    try {
      const userId = await getAuthUserId(ctx);
      if (!userId) return null;

      const followings = await ctx.db
        .query("friendships")
        .withIndex("by_follower_id", (q) => q.eq("followerId", args.userId))
        .collect();

      const data: Array<{
        user: Doc<"users">;
        friendships: Doc<"friendships">;
      }> = [];
      for (const following of followings) {
        const user = await populateUser(ctx, following.followingId);
        if (user) data.push({ user, friendships: following });
      }

      return data;
    } catch (error) {
      console.error("Error in getFollowings:", error);
      return null;
    }
  },
});

export const getRelationship = query({
  args: {
    userOneId: v.optional(v.id("users")),
    userTwoId: v.id("users"),
  },
  handler: async (ctx, args) => {
    try {
      const userId = await getAuthUserId(ctx);
      if (!userId) return null;

      const existingRelationship = await ctx.db
        .query("friendships")
        .withIndex("by_follower_id_following_id", (q) =>
          q.eq("followerId", args.userOneId).eq("followingId", args.userTwoId)
        )
        .unique();

      return existingRelationship || null;
    } catch (error) {
      console.error("Error in getRelationship:", error);
      return null;
    }
  },
});

export const create = mutation({
  args: {
    userOneId: v.id("users"),
    userTwoId: v.id("users"),
  },
  handler: async (ctx, args) => {
    try {
      const userId = await getAuthUserId(ctx);
      if (!userId) throw new Error("Unauthorized");

      const existingRelationship = await ctx.db
        .query("friendships")
        .withIndex("by_follower_id_following_id", (q) =>
          q.eq("followerId", args.userOneId).eq("followingId", args.userTwoId)
        )
        .unique();

      if (existingRelationship) {
        throw new Error("Already following the user");
      }

      return await ctx.db.insert("friendships", {
        followerId: args.userOneId,
        followingId: args.userTwoId,
      });
    } catch (error) {
      console.error("Error in create:", error);
      throw error;
    }
  },
});

export const remove = mutation({
  args: {
    userOneId: v.id("users"),
    userTwoId: v.id("users"),
  },
  handler: async (ctx, args) => {
    try {
      const userId = await getAuthUserId(ctx);
      if (!userId) throw new Error("Unauthorized");

      const existingRelationship = await ctx.db
        .query("friendships")
        .withIndex("by_follower_id_following_id", (q) =>
          q.eq("followerId", args.userOneId).eq("followingId", args.userTwoId)
        )
        .unique();

      if (!existingRelationship) {
        throw new Error("Not following the user");
      }

      await ctx.db.delete(existingRelationship._id);
    } catch (error) {
      console.error("Error in remove:", error);
      throw error;
    }
  },
});

export const toggleFollowship = mutation({
  args: {
    followerId: v.id("users"),
    followingId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { followerId, followingId } = args;

    const existingRelationship = await ctx.db
      .query("friendships")
      .withIndex("by_follower_id_following_id", (q) =>
        q.eq("followerId", followerId).eq("followingId", followingId)
      )
      .unique();

    if (existingRelationship) {
      // If the relationship exists, remove it (unfollow)
      await ctx.db.delete(existingRelationship._id);
    } else {
      // If the relationship doesn't exist, create it (follow)
      await ctx.db.insert("friendships", {
        followerId,
        followingId,
      });
    }

    // Return the new state (followed or not)
    return !existingRelationship;
  },
});
