import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter - configure based on your email provider
// For Gmail, you'll need an App Password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'motidese122119@gmail.com',
    pass: process.env.EMAIL_PASSWORD // Gmail App Password
  }
});

// Admin email where password reset tokens are sent
const ADMIN_EMAIL = 'motidese122119@gmail.com';

export const sendPasswordResetTokenToAdmin = async (userEmail, userName, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/reset-password?token=${resetToken}&email=${userEmail}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER || 'motidese122119@gmail.com',
    to: ADMIN_EMAIL,
    subject: 'Password Reset Request - ResourceMaster',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #428bca;">Password Reset Request</h2>
        <p>A user has requested a password reset for their account.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>User Details:</strong></p>
          <p><strong>Name:</strong> ${userName}</p>
          <p><strong>Email:</strong> ${userEmail}</p>
        </div>
        <p><strong>Reset Token:</strong></p>
        <div style="background-color: #e8f4f8; padding: 15px; border-radius: 5px; margin: 10px 0; word-break: break-all;">
          <code>${resetToken}</code>
        </div>
        <p>Please use this token to reset the user's password through the admin panel.</p>
        <p>Or click the link below to go directly to the reset page:</p>
        <a href="${resetUrl}" style="display: inline-block; background-color: #428bca; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px 0;">
          Reset Password
        </a>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          This token will expire in 1 hour.
        </p>
      </div>
    `
  };

  try {
    // Only send email if EMAIL_PASSWORD is configured
    if (process.env.EMAIL_PASSWORD) {
      await transporter.sendMail(mailOptions);
      console.log(`Password reset token sent to admin for user: ${userEmail}`);
      return true;
    } else {
      console.log('Email not configured. Password reset token:', resetToken);
      console.log('User:', userName, userEmail);
      return false;
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const sendNewPasswordToUser = async (userEmail, userName, newPassword) => {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'motidese122119@gmail.com',
    to: userEmail,
    subject: 'Your Password Has Been Reset - ResourceMaster',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #428bca;">Password Reset Complete</h2>
        <p>Hello ${userName},</p>
        <p>Your password has been reset by the administrator.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Your new password:</strong></p>
          <div style="background-color: #e8f4f8; padding: 15px; border-radius: 5px; margin: 10px 0;">
            <code style="font-size: 16px; font-weight: bold;">${newPassword}</code>
          </div>
        </div>
        <p>Please login with this password and change it to something more secure after logging in.</p>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" style="display: inline-block; background-color: #428bca; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px 0;">
          Login Now
        </a>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          If you did not request this password reset, please contact the administrator immediately.
        </p>
      </div>
    `
  };

  try {
    if (process.env.EMAIL_PASSWORD) {
      await transporter.sendMail(mailOptions);
      console.log(`New password sent to user: ${userEmail}`);
      return true;
    } else {
      console.log('Email not configured. New password:', newPassword);
      console.log('User:', userName, userEmail);
      return false;
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

