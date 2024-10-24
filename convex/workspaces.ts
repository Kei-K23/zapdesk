import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "./_generated/dataModel";

const generateCode = () =>
  Array.from(
    { length: 6 },
    () =>
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"[
        Math.floor(Math.random() * 62)
      ]
  ).join("");

export const createWorkspace = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const workspaceId = await ctx.db.insert("workspaces", {
      name: args.name,
      userId,
      joinCode: generateCode(),
    });

    // Create default admin member
    await ctx.db.insert("members", {
      userId,
      workspaceId,
      role: "admin",
    });

    // Create default general channel for this workspace
    await ctx.db.insert("channels", {
      name: "general",
      workspaceId,
    });

    return workspaceId;
  },
});

export const updateWorkspace = mutation({
  args: {
    id: v.id("workspaces"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, {
      name: args.name,
    });

    return args.id;
  },
});

export const updateJoinCode = mutation({
  args: {
    id: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.id).eq("userId", userId)
      )
      .unique();

    if (!currentMember) {
      throw new Error("Unauthorized");
    }

    if (currentMember.role !== "admin") {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, {
      joinCode: generateCode(),
    });

    return args.id;
  },
});

export const deleteWorkspace = mutation({
  args: {
    id: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Delete the all related channel
    const channels = await ctx.db
      .query("channels")
      .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.id))
      .collect();

    const channelIds = channels.length > 0 ? channels.map((ch) => ch._id) : [];
    for (const channelId of channelIds) {
      await ctx.db.delete(channelId);
    }

    // Delete the all related members
    const members = await ctx.db
      .query("members")
      .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.id))
      .collect();

    const memberIds = members.length > 0 ? members.map((ch) => ch._id) : [];
    for (const memberId of memberIds) {
      await ctx.db.delete(memberId);
    }

    // Delete the workspace
    await ctx.db.delete(args.id);

    return args.id;
  },
});

export const getWorkspace = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return [];
    }

    const members = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();

    const workspaceIds = members.map((m) => m.workspaceId);
    const workspaces = [];

    for (const workspaceId of workspaceIds) {
      const workspace = await ctx.db.get(workspaceId);
      if (workspace) {
        workspaces.push(workspace);
      }
    }

    return workspaces;
  },
});

export const getWorkspaceById = query({
  args: { id: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    return await ctx.db.get(args.id);
  },
});

export const getChannelsAndMembers = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return {};
    }

    const [channels, members] = await Promise.all([
      await ctx.db
        .query("channels")
        .withIndex("by_workspace_id", (q) =>
          q.eq("workspaceId", args.workspaceId)
        )
        .collect(),
      await ctx.db
        .query("members")
        .withIndex("by_workspace_id", (q) =>
          q.eq("workspaceId", args.workspaceId)
        )
        .collect(),
    ]);

    if (!channels.length || !members.length) {
      return {};
    }

    const membersWithUser: { user: Doc<"users">; member: Doc<"members"> }[] =
      [];

    for (const member of members) {
      const user = await ctx.db.get(member.userId);
      if (user) {
        const result = {
          user,
          member,
        };
        membersWithUser.push(result);
      }
    }

    return {
      channels,
      members: membersWithUser,
    };
  },
});

export const getMutualWorkspaces = query({
  args: {
    userId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return [];
    }

    const currentUserMembers = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();

    const currentUserWorkspaceIds = currentUserMembers.map(
      (m) => m.workspaceId
    );
    const currentUserWorkspaces: {
      _id: Id<"workspaces">;
      _creationTime: number;
      name: string;
      userId: Id<"users">;
      joinCode: string;
    }[] = [];

    for (const workspaceId of currentUserWorkspaceIds) {
      const workspace = await ctx.db.get(workspaceId);
      if (workspace) {
        currentUserWorkspaces.push(workspace);
      }
    }

    const otherUserMembers = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();

    const otherUserWorkspaceIds = otherUserMembers.map((m) => m.workspaceId);
    const otherUserWorkspaces: {
      _id: Id<"workspaces">;
      _creationTime: number;
      name: string;
      userId: Id<"users">;
      joinCode: string;
    }[] = [];

    for (const workspaceId of otherUserWorkspaceIds) {
      const workspace = await ctx.db.get(workspaceId);
      if (workspace) {
        otherUserWorkspaces.push(workspace);
      }
    }

    // Find mutual workspaces
    const mutualWorkspaces = currentUserWorkspaces.filter((currentWorkspace) =>
      otherUserWorkspaces.some(
        (otherWorkspace) => otherWorkspace._id === currentWorkspace._id
      )
    );

    return mutualWorkspaces;
  },
});
