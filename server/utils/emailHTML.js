const getVerificationEmailHTML = (verificationLink, userName) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Auragram Account</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f0fdfa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">

                    <!-- Header with gradient -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                                Auragram
                            </h1>
                            <p style="margin: 10px 0 0 0; color: #ccfbf1; font-size: 14px; letter-spacing: 0.5px;">
                                SOCIAL MEDIA REIMAGINED
                            </p>
                        </td>
                    </tr>

                    <!-- Main content -->
                    <tr>
                        <td style="padding: 50px 40px;">
                            <h2 style="margin: 0 0 20px 0; color: #115e59; font-size: 24px; font-weight: 600;">
                                Welcome${userName ? `, ${userName}` : ''}! 👋
                            </h2>

                            <p style="margin: 0 0 20px 0; color: #134e4a; font-size: 16px; line-height: 1.6;">
                                Thank you for joining <strong>Auragram</strong>! We're excited to have you as part of our community.
                            </p>

                            <p style="margin: 0 0 30px 0; color: #134e4a; font-size: 16px; line-height: 1.6;">
                                To get started and unlock all features, please verify your email address by clicking the button below:
                            </p>

                            <!-- Verification button -->
                            <table role="presentation" style="margin: 0 auto;">
                                <tr>
                                    <td style="border-radius: 8px; background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%); box-shadow: 0 4px 12px rgba(20, 184, 166, 0.3);">
                                        <a href="${verificationLink}"
                                           style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; letter-spacing: 0.3px;">
                                            Verify Email Address
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 30px 0 0 0; color: #134e4a; font-size: 14px; line-height: 1.6;">
                                Or copy and paste this link into your browser:
                            </p>

                            <div style="margin: 15px 0 0 0; padding: 15px; background-color: #f0fdfa; border-left: 4px solid #14b8a6; border-radius: 4px; word-break: break-all;">
                                <a href="${verificationLink}" style="color: #0d9488; text-decoration: none; font-size: 13px;">
                                    ${verificationLink}
                                </a>
                            </div>

                            <div style="margin: 30px 0 0 0; padding: 20px; background-color: #ccfbf1; border-radius: 8px; border: 1px solid #99f6e4;">
                                <p style="margin: 0; color: #115e59; font-size: 14px; line-height: 1.5;">
                                    <strong>Quick tip:</strong> This verification link will expire in 24 hours for security reasons. If it expires, you can request a new one from the login page.
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                        <td style="padding: 0 40px;">
                            <div style="border-top: 1px solid #e5e7eb;"></div>
                        </td>
                    </tr>

                    <!-- Security notice -->
                    <tr>
                        <td style="padding: 30px 40px;">
                            <p style="margin: 0 0 15px 0; color: #475569; font-size: 13px; line-height: 1.6;">
                                <strong>❗ Security Notice:</strong>
                            </p>
                            <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.6;">
                                If you didn't create an account with Auragram, please ignore this email. Your email address will not be used without verification.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f0fdfa; padding: 30px 40px; text-align: center;">
                            <p style="margin: 0 0 10px 0; color: #115e59; font-size: 14px; font-weight: 600;">
                                Auragram
                            </p>
                            <p style="margin: 0 0 15px 0; color: #64748b; font-size: 12px; line-height: 1.5;">
                                Connect, Share, and Inspire
                            </p>
                            <div style="margin: 15px 0 0 0;">
                                <a href="#" style="display: inline-block; margin: 0 8px; color: #0d9488; text-decoration: none; font-size: 12px;">Privacy Policy</a>
                                <span style="color: #cbd5e1;">"</span>
                                <a href="#" style="display: inline-block; margin: 0 8px; color: #0d9488; text-decoration: none; font-size: 12px;">Terms of Service</a>
                                <span style="color: #cbd5e1;">"</span>
                                <a href="#" style="display: inline-block; margin: 0 8px; color: #0d9488; text-decoration: none; font-size: 12px;">Contact Us</a>
                            </div>
                            <p style="margin: 20px 0 0 0; color: #94a3b8; font-size: 11px;">
                                ${new Date().getFullYear()} Auragram. All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>

                <!-- Bottom spacing -->
                <table role="presentation" style="max-width: 600px; margin: 20px auto 0;">
                    <tr>
                        <td style="text-align: center; padding: 0 20px;">
                            <p style="margin: 0; color: #64748b; font-size: 11px; line-height: 1.5;">
                                This email was sent to you because you signed up for Auragram.<br>
                                Please do not reply to this email.
                            </p>
                        </td>
                    </tr>
                </table>

            </td>
        </tr>
    </table>
</body>
</html>
  `;
};

module.exports = { getVerificationEmailHTML };
