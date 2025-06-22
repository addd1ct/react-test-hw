import bcrypt from 'bcryptjs';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { User } from '../models/user.models.js';
import { Session } from '../models/session.models.js';

export const registerUserService = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });
  return user;
};

export const loginUserService = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Email or password is wrong');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createHttpError(401, 'Email or password is wrong');
  }

  await Session.findOneAndDelete({ userId: user._id });

  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
  const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken, refreshToken };
};

export const refreshSessionService = async (refreshToken) => {
  if (!refreshToken) {
    throw createHttpError(401, 'Refresh token is missing');
  }

  const session = await Session.findOne({ refreshToken });
  if (!session) {
    throw createHttpError(403, 'Session not found');
  }

  const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
  const accessToken = jwt.sign({ userId: payload.userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const newRefreshToken = jwt.sign({ userId: payload.userId }, process.env.JWT_SECRET, { expiresIn: '30d' });

  session.accessToken = accessToken;
  session.refreshToken = newRefreshToken;
  session.accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
  session.refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await session.save();

  return { accessToken, newRefreshToken };
};

export const logoutUserService = async (refreshToken) => {
  if (!refreshToken) {
    throw createHttpError(401, 'Refresh token is missing');
  }

  await Session.findOneAndDelete({ refreshToken });
};

export const sendResetEmailService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5m' });

  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 5 minutes.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }
};

export const resetPasswordService = async (token, newPassword) => {
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw createHttpError(401, 'Invalid or expired token');
  }

  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
};
