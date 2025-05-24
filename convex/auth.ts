import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Query to get the current user
export const getUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
      .first();

    return user;
  },
});

// Mutation to create or update a user
export const createOrUpdateUser = internalMutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    pictureUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    // Verify user exists in Supabase
    const { data: supabaseUser, error } = await supabase.auth.getUser();
    if (error || !supabaseUser.user) {
      throw new ConvexError("User not found in Supabase");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
      .first();

    if (user) {
      // Update existing user
      return await ctx.db.patch(user._id, {
        email: args.email,
        name: args.name,
        pictureUrl: args.pictureUrl,
      });
    }

    // Create new user
    return await ctx.db.insert("users", {
      tokenIdentifier: identity.tokenIdentifier,
      email: args.email,
      name: args.name,
      pictureUrl: args.pictureUrl,
    });
  },
});

// Mutation to delete a user
export const deleteUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
      .first();

    if (user) {
      await ctx.db.delete(user._id);
    }
  },
});
