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

export const updateMember = mutation({
  args: {
    memberId: v.id("members"),
    workspaceId: v.id("workspaces"),
    role: v.union(
      v.literal("admin"),
      v.literal("member"),
      v.literal("moderator")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!currentMember || currentMember.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const member = await ctx.db.get(args.memberId);
    if (!member) {
      throw new Error("Member not found to update");
    }

    await ctx.db.patch(member._id, {
      role: args.role,
    });

    return member._id;
  },
});

export const deleteMember = mutation({
  args: {
    memberId: v.id("members"),
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const member = await ctx.db.get(args.memberId);

    if (!member) {
      throw new Error("Member not found to delete");
    }

    if (member.role === "admin") {
      throw new Error("Admin cannot delete their self");
    }

    // Delete all related data with deleted member messages, reactions and conversations

    const messages = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("memberId"), member._id))
      .filter((q) => q.eq(q.field("workspaceId"), args.workspaceId))
      .collect();

    const reactions = await ctx.db
      .query("reactions")
      .filter((q) => q.eq(q.field("memberId"), member._id))
      .filter((q) => q.eq(q.field("workspaceId"), args.workspaceId))
      .collect();

    const conversations = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("memberOneId"), member._id))
      .filter((q) => q.eq(q.field("memberTwoId"), member._id))
      .filter((q) => q.eq(q.field("workspaceId"), args.workspaceId))
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    for (const reaction of reactions) {
      await ctx.db.delete(reaction._id);
    }

    for (const conversation of conversations) {
      await ctx.db.delete(conversation._id);
    }

    await ctx.db.delete(member._id);

    return member._id;
  },
});
