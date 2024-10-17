import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";

const populateThread = async (ctx: QueryCtx, messageId: Id<"messages">) => {
  const messages = await ctx.db
    .query("messages")
    .withIndex("by_parent_message_id", (q) =>
      q.eq("parentMessageId", messageId)
    )
    .collect();

  if (messages.length === 0) {
    return {
      count: 0,
      image: undefined,
      timestamp: 0,
    };
  }

  // Get the latest thread message and member of that message
  const lastMessage = messages[messages.length - 1];
  const lastMessageMember = await populateMember(ctx, lastMessage.memberId);

  if (!lastMessageMember) {
    return {
      count: 0,
      image: undefined,
      timestamp: 0,
    };
  }

  const lastMessageUser = await populateUser(ctx, lastMessageMember.userId);

  if (!lastMessageUser) {
    return {
      count: 0,
      image: undefined,
      timestamp: 0,
    };
  }

  return {
    count: messages.length,
    image: lastMessageUser.image,
    timestamp: lastMessage._creationTime,
  };
};

const populateReactions = async (ctx: QueryCtx, messageId: Id<"messages">) => {
  return await ctx.db
    .query("reactions")
    .withIndex("by_message_id", (q) => q.eq("messageId", messageId))
    .collect();
};

const populateUser = async (ctx: QueryCtx, userId: Id<"users">) => {
  return await ctx.db.get(userId);
};

const populateMember = async (ctx: QueryCtx, memberId: Id<"members">) => {
  return await ctx.db.get(memberId);
};

const getMember = async (
  ctx: QueryCtx,
  workspaceId: Id<"workspaces">,
  userId: Id<"users">
) => {
  return ctx.db
    .query("members")
    .withIndex("by_workspace_id_user_id", (q) =>
      q.eq("workspaceId", workspaceId).eq("userId", userId)
    )
    .unique();
};

export const createMessage = mutation({
  args: {
    body: v.string(),
    image: v.optional(v.id("_storage")),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    parentMessageId: v.optional(v.id("messages")),
    conversationId: v.optional(v.id("conversations")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const member = await getMember(ctx, args.workspaceId, userId);
    if (!member) {
      throw new Error("Unauthorized");
    }

    let conversationId = args.conversationId;
    if (!args.conversationId && !args.channelId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId);
      if (!parentMessage) {
        throw new Error("Parent message not found");
      }

      conversationId = parentMessage.conversationId;
    }

    return await ctx.db.insert("messages", {
      body: args.body,
      image: args.image,
      workspaceId: args.workspaceId,
      channelId: args.channelId,
      parentMessageId: args.parentMessageId,
      conversationId,
      memberId: member._id,
      createdAt: Date.now(),
    });
  },
});

export const getMessages = query({
  args: {
    channelId: v.optional(v.id("channels")),
    parentMessageId: v.optional(v.id("messages")),
    conversationId: v.optional(v.id("conversations")),
    paginationOps: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    let conversationId = args.conversationId;
    if (!args.conversationId && !args.channelId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId);
      if (!parentMessage) {
        throw new Error("Parent message not found");
      }

      conversationId = parentMessage.conversationId;
    }

    const results = await ctx.db
      .query("messages")
      .withIndex("by_channel_id_parent_message_id_conversation_id", (q) =>
        q
          .eq("channelId", args.channelId)
          .eq("parentMessageId", args.parentMessageId)
          .eq("conversationId", args.conversationId)
      )
      .order("desc")
      .paginate(args.paginationOps);

    return results;
  },
});
