import { hash, compare } from 'bcryptjs'

const SALT_ROUNDS = 10

/**
 * Hashes a plain text password.
 * @param password - The plain text password to hash.
 * @returns The hashed password.
 */
export const hashPassword = async (password: string): Promise<string> =>
  hash(password, SALT_ROUNDS)

/**
 * Compares a plain text password with a hashed password.
 * @param plainPassword - The plain text password.
 * @param hashedPassword - The hashed password.
 * @returns True if the passwords match, false otherwise.
 */
export const comparePasswords = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => compare(plainPassword, hashedPassword)
