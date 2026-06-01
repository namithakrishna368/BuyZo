import { generateOtp, hashOtp, OTP_EXPIRY_MS } from './otp.js';
import { sendOtpEmail } from './sendEmail.js';

export const assignAndSendOtp = async (user, purpose) => {
  const otp = generateOtp();
  user.emailOtp = hashOtp(otp);
  user.emailOtpExpires = Date.now() + OTP_EXPIRY_MS;
  user.otpPurpose = purpose;
  await user.save();

  const emailResult = await sendOtpEmail(user.email, user.name, otp, purpose);

  return {
    ...emailResult,
    devOtp: emailResult.devOtp || (emailResult.devMode ? otp : undefined),
  };
};

export const verifyUserOtp = (user, otp, expectedPurpose) => {
  if (!user.emailOtp || !user.emailOtpExpires) {
    return { valid: false, message: 'No OTP found. Please request a new code.' };
  }

  if (user.otpPurpose !== expectedPurpose) {
    return { valid: false, message: 'Invalid OTP type. Please request a new code.' };
  }

  if (user.emailOtpExpires < Date.now()) {
    return { valid: false, message: 'OTP has expired. Please request a new code.' };
  }

  if (user.emailOtp !== hashOtp(otp)) {
    return { valid: false, message: 'Invalid OTP. Please try again.' };
  }

  return { valid: true };
};

export const clearUserOtp = (user) => {
  user.emailOtp = undefined;
  user.emailOtpExpires = undefined;
  user.otpPurpose = undefined;
};
