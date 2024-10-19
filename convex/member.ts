import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query, QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { Id, Doc } from "./_generated/dataModel";

const getUserDataById = async (ctx: QueryCtx, id: Id<"users">) => {
  return ctx.db.get(id);
};

export const currentMember = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    return await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();
  },
});

export const createNewMember = mutation({
  args: { workspaceId: v.id("workspaces"), joinCode: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const workspace = await ctx.db
      .query("workspaces")
      .withIndex("by_id", (q) => q.eq("_id", args.workspaceId))
      .filter((q) => q.eq(q.field("joinCode"), args.joinCode))
      .unique();

    if (!workspace) {
      throw new Error("Could not found the workspace to join");
    }

    const existingMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    if (existingMember) {
      throw new Error("This user is already active member of this workspace");
    }

    return await ctx.db.insert("members", {
      userId,
      workspaceId: args.workspaceId,
      role: "member",
    });
  },
});

export const getMembers = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const membersData: Array<{ user: Doc<"users">; member: Doc<"members"> }> =
      [];
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return [];
    }

    const members = await ctx.db
      .query("members")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .collect();

    if (!members.length) {
      return [];
    }

    for (const member of members) {
      const userData = await getUserDataById(ctx, member.userId);

      membersData.push({
        user: userData!,
        member: member,
      });
    }

    return membersData;
  },
});

export const getMemberById = query({
  args: {
    id: v.id("members"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    const member = await ctx.db.get(args.id);

    if (!member) {
      return null;
    }

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", member.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!currentMember) {
      return null;
    }

    const currentUser = await getUserDataById(ctx, member.userId);

    if (!currentUser) {
      return null;
    }

    return {
      user: currentUser,
      member: currentMember,
    };
  },
});

export const getAdminMember = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    const adminMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .filter((q) => q.eq(q.field("role"), "admin"))
      .unique();

    if (!adminMember) {
      return null;
    }

    return await getUserDataById(ctx, adminMember.userId);
  },
});
