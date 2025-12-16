import { EmailService } from "@/services/email.service";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { prisma } from "./prisma";
import { assertValue } from "./utils";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    autoSignIn: true, // Auto sign in after registration
    requireEmailVerification: false, // Disabled for development
    resetPasswordTokenExpiresIn: 60 * 60,
    minPasswordLength: 6,

    sendResetPassword: async ({ user, url }) => {
      await EmailService.sendResetPasswordEmail(
        { name: user.name, email: user.email },
        url,
      );
    },
  },
  emailVerification: {
    sendOnSignUp: false, // Disabled for development
    expiresIn: 60 * 60,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await EmailService.sendVerificationEmail(
        { name: user.name, email: user.email },
        url,
      );
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "dummy-github-client-id",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "dummy-github-secret",
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID || "dummy-discord-client-id",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "dummy-discord-secret",
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "dummy-google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy-google-secret",
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github", "discord"],
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false, // don't allow users to set their own role
      },
    },
  },
  rateLimit: {
    enabled: true,
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    nextCookies(),
    admin({
      //todo add admin user ids
      adminUserIds: ["fLN6DoGcLUWiYOWuLQgktIrVD5euLpZk"],
    }),
  ],
});
