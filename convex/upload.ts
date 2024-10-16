import { mutation } from "./_generated/server";

export const generateUploadImageUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});
