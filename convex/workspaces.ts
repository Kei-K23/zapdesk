import { query } from "./_generated/server";

export const getWorkspace = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("workspaces").collect();
  },
});
