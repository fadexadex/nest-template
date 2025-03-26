import * as argon from 'argon2';

export const hashPassword = async (password: string) => {
  return await argon.hash(password);
};

export const comparePassword = async (
  passwordHash: string,
  password: string,
) => {
  return await argon.verify(passwordHash, password);
};
