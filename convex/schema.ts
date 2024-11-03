import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    isPublishEmail: v.optional(v.boolean()),
    bio: v.optional(v.string()),
    role: v.optional(v.string()),
    githubLink: v.optional(v.string()),
    personalLink: v.optional(v.string()),
    twitterLink: v.optional(v.string()),
    youTubeLink: v.optional(v.string()),
    igLink: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
  }).index("email", ["email"]),
  workspaces: defineTable({
    name: v.string(),
    userId: v.id("users"),
    joinCode: v.string(),
  }),
  members: defineTable({
    userId: v.id("users"),
    workspaceId: v.id("workspaces"),
    image: v.optional(v.id("_storage")),
    role: v.union(
      v.literal("admin"),
      v.literal("member"),
      v.literal("moderator")
    ),
  })
    .index("by_user_id", ["userId"])
    .index("by_workspace_id", ["workspaceId"])
    .index("by_workspace_id_user_id", ["workspaceId", "userId"]),
  channels: defineTable({
    name: v.string(),
    workspaceId: v.id("workspaces"),
  }).index("by_workspace_id", ["workspaceId"]),
  conversations: defineTable({
    workspaceId: v.id("workspaces"),
    memberOneId: v.id("members"), // Represent sender
    memberTwoId: v.id("members"), // Represent receiver
  }).index("by_workspace_id", ["workspaceId"]),
  friendships: defineTable({
    followerId: v.optional(v.id("users")),
    followingId: v.id("users"),
  })
    .index("by_follower_id", ["followerId"])
    .index("by_following_id", ["followingId"])
    .index("by_follower_id_following_id", ["followerId", "followingId"]),
  messages: defineTable({
    body: v.string(),
    image: v.optional(v.id("_storage")),
    memberId: v.id("members"),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    parentMessageId: v.optional(v.id("messages")),
    conversationId: v.optional(v.id("conversations")),
    updatedAt: v.optional(v.number()),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_member_id", ["memberId"])
    .index("by_channel_id", ["channelId"])
    .index("by_conversation_id", ["conversationId"])
    .index("by_parent_message_id", ["parentMessageId"])
    .index("by_channel_id_parent_message_id_conversation_id", [
      "channelId",
      "parentMessageId",
      "conversationId",
    ]),
  blogs: defineTable({
    title: v.string(),
    description: v.string(),
    content: v.string(),
    image: v.optional(v.id("_storage")),
    userId: v.id("users"),
    updatedAt: v.optional(v.number()),
  }).index("by_user_id", ["userId"]),
  tags: defineTable({
    name: v.string(),
  }).index("by_name", ["name"]),
  blogsTags: defineTable({
    tagId: v.id("tags"),
    blogId: v.id("blogs"),
  })
    .index("by_blog_id", ["blogId"])
    .index("by_tag_id", ["tagId"])
    .index("by_blog_id_tag_id", ["blogId", "tagId"]),
  blogLikes: defineTable({
    blogId: v.id("blogs"),
    userId: v.id("users"),
  })
    .index("by_blog_id_user_id", ["blogId", "userId"])
    .index("by_blog_id", ["blogId"])
    .index("by_user_id", ["userId"]),
  comments: defineTable({
    body: v.string(),
    image: v.optional(v.id("_storage")),
    userId: v.id("users"),
    blogId: v.id("blogs"),
    parentCommentId: v.optional(v.id("comments")),
    updatedAt: v.optional(v.number()),
  })
    .index("by_user_id", ["userId"])
    .index("by_blog_id", ["blogId"])
    .index("by_parent_comment_id", ["parentCommentId"])
    .index("by_user_id_blog_id", ["userId", "blogId"])
    .index("by_user_id_blog_id_parent_id", [
      "userId",
      "blogId",
      "parentCommentId",
    ]),
  reactions: defineTable({
    memberId: v.id("members"),
    workspaceId: v.id("workspaces"),
    messageId: v.id("messages"),
    value: v.string(),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_member_id", ["memberId"])
    .index("by_message_id", ["messageId"]),
});

export default schema;
