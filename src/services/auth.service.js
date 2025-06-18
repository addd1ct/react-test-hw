import bcrypt from 'bcryptjs';
import createHttpError from 'http-errors';
import { User } from '../models/user.models.js';

export const register = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });
  return user;
};
