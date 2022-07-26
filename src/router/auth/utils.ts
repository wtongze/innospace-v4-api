import crypto from 'crypto';
import type { Request } from 'express';
import config from '@src/config';

export async function getPasswordSalt(): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(128, (err, buf) => {
      if (err) reject(err);
      else resolve(buf.toString('base64'));
    });
  });
}

export async function getPasswordHash(
  password: string,
  salt: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      password.normalize(),
      salt.normalize(),
      config.sequelize.USER_PASSWORD_PBKDF2_ITERATIONS,
      config.sequelize.USER_PASSWORD_PBKDF2_KEY_LENGTH,
      config.sequelize.USER_PASSWORD_PBKDF2_DIGEST,
      (err, key) => {
        if (err) {
          reject(err);
        } else {
          resolve(key.toString('base64'));
        }
      }
    );
  });
}

export async function login(req: Request, user: Express.User) {
  return new Promise<void>((resolve, reject) => {
    req.login(user, (err: Error | null) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export async function logout(req: Request) {
  return new Promise<void>((resolve, reject) => {
    req.logout((err: Error | null) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
