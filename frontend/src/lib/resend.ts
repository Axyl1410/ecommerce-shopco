import { Resend } from "resend";

// Make RESEND_SECRET optional for development
const key = process.env.RESEND_SECRET || "dummy-key-for-development";

export const resend = new Resend(key);
