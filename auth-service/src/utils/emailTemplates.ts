export const getPasswordResetTemplate = (resetUrl: string) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            /* Responsive styles for mobile */
            @media only screen and (max-width: 600px) {
                .container { width: 100% !important; padding: 10px !important; }
                .button { width: 100% !important; display: block !important; text-align: center; }
            }
        </style>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
        <div class="container" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
            
            <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: #333; margin: 0;">Notes App</h2>
            </div>

            <div style="color: #555; font-size: 16px; line-height: 1.6;">
                <h3 style="color: #333;">Reset Your Password</h3>
                <p>Hello,</p>
                <p>We received a request to reset your password for your Notes App account. If you made this request, please click the button below:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" class="button" style="background-color: #4CAF50; color: white; padding: 14px 28px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">
                        Reset Password
                    </a>
                </div>

                <p style="margin-bottom: 30px;">If the button above doesn't work, copy and paste the following link into your browser:</p>
                
                <p style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; word-break: break-all; font-size: 14px; color: #666;">
                    <a href="${resetUrl}" style="color: #4CAF50;">${resetUrl}</a>
                </p>

                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

                <p style="color: #999; font-size: 13px; text-align: center;">
                    If you didn't request a password reset, you can safely ignore this email. Your account is secure.
                </p>
            </div>
            
            <div style="text-align: center; margin-top: 40px; color: #aaa; font-size: 12px;">
                &copy; ${new Date().getFullYear()} Notes App. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    `;
};