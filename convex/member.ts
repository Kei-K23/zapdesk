import { getAuthUserId } from "@convex-dev/auth/server";
import { query, QueryCtx } from "./_generated/server";
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
