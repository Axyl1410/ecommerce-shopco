import ResetPasswordEmail from "@/components/email/reset-password";
import VerificationEmail from "@/components/email/verification-email";
import { resend } from "@/lib/resend";

export interface EmailUser {
  name: string;
  email: string;
}

export class EmailService {
  /**
   * Send reset password email
   */
  static async sendResetPasswordEmail(user: EmailUser, resetUrl: string) {
    const link = new URL(resetUrl);
    link.searchParams.set("callbackURL", "/new-password");

    try {
      await resend.emails.send({
        to: [user.email],
        from: "Axyl Team <onboarding@resend.dev>",
        subject: "Reset your password",
        react: ResetPasswordEmail({
          userFirstname: user.name,
          resetPasswordLink: link.toString(),
        }),
      });
    } catch (error) {
      console.error("Failed to send reset password email:", error);
      throw new Error("Failed to send reset password email");
    }
  }

  /**
   * Send email verification email
   */
  static async sendVerificationEmail(user: EmailUser, verificationUrl: string) {
    const link = new URL(verificationUrl);
    link.searchParams.set("callbackURL", "/welcome");

    try {
      await resend.emails.send({
        to: [user.email],
        from: "Axyl Team <onboarding@resend.dev>",
        subject: "Verify your email",
        react: VerificationEmail({
          userFirstname: user.name,
          verificationLink: link.toString(),
        }),
      });
    } catch (error) {
      console.error("Failed to send verification email:", error);
      throw new Error("Failed to send verification email");
    }
  }
}
