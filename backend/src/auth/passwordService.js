import argon2 from 'argon2';

/**
 * Hash a plain text password using Argon2id.
 * @param {string} password
 * @returns {Promise<string>} The password hash
 */
export const hashPassword = async (password) => {
  try {
    return await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 64 MB
      timeCost: 3,         // 3 iterations
      parallelism: 4       // 4 threads
    });
  } catch (error) {
    throw new Error(`Password hashing failed: ${error.message}`);
  }
};

/**
 * Verify a plain text password against a hash.
 * @param {string} hash
 * @param {string} password
 * @returns {Promise<boolean>} True if matching, false otherwise
 */
export const verifyPassword = async (hash, password) => {
  try {
    return await argon2.verify(hash, password);
  } catch (error) {
    throw new Error(`Password verification failed: ${error.message}`);
  }
};
