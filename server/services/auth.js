import bcrypt from 'bcryptjs';

const saltRounds = 10;

export const hashedPassword = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};

export const matchPassword = async (password, userPassword) => {
  return await bcrypt.compare(password, userPassword);
};
