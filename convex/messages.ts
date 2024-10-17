import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "./_generated/dataModel";
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
    updatedAt: v.optional(v.number()),
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
    });
  },
});

export const getMessages = query({
  args: {
    channelId: v.optional(v.id("channels")),
    parentMessageId: v.optional(v.id("messages")),
    conversationId: v.optional(v.id("conversations")),
    paginationOpts: paginationOptsValidator,
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
      .paginate(args.paginationOpts);

    return {
      ...results,
      page: await Promise.all(
        results.page
          .map(async (message) => {
            const member = await populateMember(ctx, message.memberId);
            const user = member ? await populateUser(ctx, member.userId) : null;
            if (!member || !user) {
              return null;
            }

            const reactions = await populateReactions(ctx, message._id);
            const thread = await populateThread(ctx, message._id);

            const image = message.image
              ? await ctx.storage.getUrl(message.image)
              : undefined;

            const reactionsWithCounts = reactions.map((reaction) => ({
              ...reaction,
              count: reactions.filter((r) => r.value === reaction.value).length,
            }));

            const dedupedReactions = reactionsWithCounts.reduce(
              (acc, reaction) => {
                const existingReaction = acc.find(
                  (r) => r.value === reaction.value
                );

                if (existingReaction) {
                  existingReaction.memberIds = Array.from(
                    new Set([...existingReaction.memberIds, reaction.memberId])
                  );
                } else {
                  acc.push({ ...reaction, memberIds: [reaction.memberId] });
                }

                return acc;
              },
              [] as (Doc<"reactions"> & {
                count: number;
                memberIds: Id<"members">[];
              })[]
            );

            const reactionsWithoutMemberIdProperty = dedupedReactions.map(
              ({ memberId, ...rest }) => rest
            );

            return {
              ...message,
              member,
              image,
              user,
              reactions: reactionsWithoutMemberIdProperty,
              threadCount: thread.count,
              threadImage: thread.image,
              threadTimestamp: thread.timestamp,
            };
          })
          .filter(
            (message): message is NonNullable<typeof message> =>
              message !== null
          )
      ),
    };
  },
});

export const updateMessage = mutation({
  args: {
    id: v.id("messages"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const message = await ctx.db.get(args.id);
    if (!message) {
      throw new Error("Cannot find the message");
    }

    const member = await getMember(ctx, message.workspaceId, userId);

    if (!member || message.memberId !== member._id) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, {
      body: args.body,
    });

    return args.id;
  },
});

export const deleteMessage = mutation({
  args: {
    id: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const message = await ctx.db.get(args.id);
    if (!message) {
      throw new Error("Cannot find the message");
    }

    const member = await getMember(ctx, message.workspaceId, userId);

    if (!member || message.memberId !== member._id) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);

    return args.id;
  },
});
