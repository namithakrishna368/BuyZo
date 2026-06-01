import nodemailer from 'nodemailer';
import { isSmtpConfigured } from './appConfig.js';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
};

export const sendVerificationEmail = async (email, name, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  if (!isSmtpConfigured()) {
    if (process.env.NODE_ENV === 'development') {
      console.log('\n--- BuyZO: SMTP not configured (dev mode) ---');
      console.log(`Verify email for ${email}:`);
      console.log(verifyUrl);
      console.log('-------------------------------------------\n');
      return { sent: false, devMode: true, verifyUrl };
    }
    throw new Error('Email service is not configured. Set SMTP_USER and SMTP_PASS in backend/.env');
  }

  const transporter = createTransporter();
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'BuyZO <noreply@buyzo.com>',
    to: email,
    subject: 'Verify your BuyZO account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8f6f3;">
        <div style="background: #1e3a5f; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: #f8f6f3; margin: 0; font-size: 28px;">BuyZO</h1>
        </div>
        <div style="background: white; padding: 32px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #1e3a5f;">Hello ${name || 'there'}!</h2>
          <p style="color: #333; line-height: 1.6;">Thank you for registering with BuyZO. Please verify your email address by clicking the button below:</p>
          <a href="${verifyUrl}" style="display: inline-block; background: #1e3a5f; color: #f8f6f3; padding: 14px 28px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold;">Verify Email</a>
          <p style="color: #666; font-size: 14px;">This link expires in 24 hours. If you didn't create an account, please ignore this email.</p>
          <p style="color: #999; font-size: 12px; word-break: break-all;">Or copy this link: ${verifyUrl}</p>
        </div>
      </div>
    `,
  });

  return { sent: true, devMode: false };
};

export const sendPasswordResetEmail = async (email, name, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  if (!isSmtpConfigured()) {
    if (process.env.NODE_ENV === 'development') {
      console.log('\n--- BuyZO: Password reset link (dev) ---');
      console.log(`Reset password for ${email}:`);
      console.log(resetUrl);
      console.log('------------------------------------\n');
      return { sent: false, devMode: true, resetUrl };
    }
    throw new Error('Email service is not configured.');
  }

  const transporter = createTransporter();
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'BuyZO <noreply@buyzo.com>',
    to: email,
    subject: 'Reset your BuyZO password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8f6f3;">
        <div style="background: #1e3a5f; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: #f8f6f3; margin: 0; font-size: 28px;">BuyZO</h1>
        </div>
        <div style="background: white; padding: 32px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #1e3a5f;">Reset your password</h2>
          <p style="color: #333;">Hi ${name || 'there'}, click below to set a new password. This link expires in 1 hour.</p>
          <a href="${resetUrl}" style="display: inline-block; background: #1e3a5f; color: #f8f6f3; padding: 14px 28px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold;">Reset Password</a>
          <p style="color: #999; font-size: 12px; word-break: break-all;">${resetUrl}</p>
        </div>
      </div>
    `,
  });

  return { sent: true, devMode: false };
};

export const sendOtpEmail = async (email, name, otp, purpose = 'verify') => {
  const isReset = purpose === 'reset';
  const subject = isReset ? 'Your BuyZO password reset code' : 'Your BuyZO verification code';
  const heading = isReset ? 'Password reset code' : 'Email verification code';
  const instruction = isReset
    ? 'Use this code to reset your password. It expires in 10 minutes.'
    : 'Use this code to verify your email and complete registration. It expires in 10 minutes.';

  if (!isSmtpConfigured()) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`\n--- BuyZO OTP (${purpose}) for ${email}: ${otp} ---\n`);
      return { sent: false, devMode: true, devOtp: otp };
    }
    throw new Error('Email service is not configured.');
  }

  const transporter = createTransporter();
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'BuyZO <noreply@buyzo.com>',
    to: email,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8f6f3;">
        <div style="background: #1e3a5f; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: #f8f6f3; margin: 0; font-size: 28px;">BuyZO</h1>
        </div>
        <div style="background: white; padding: 32px; border-radius: 0 0 8px 8px; text-align: center;">
          <h2 style="color: #1e3a5f;">${heading}</h2>
          <p style="color: #333;">Hi ${name || 'there'}, ${instruction}</p>
          <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1e3a5f; margin: 24px 0; padding: 16px; background: #f8f6f3; border-radius: 8px;">${otp}</div>
          <p style="color: #999; font-size: 12px;">Do not share this code with anyone.</p>
        </div>
      </div>
    `,
  });

  return { sent: true, devMode: false };
};
