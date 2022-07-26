import fs, { constants } from 'fs';
import path from 'path';
import { CustomValidator } from 'express-validator';
import config from '@src/config';

export async function hasPath(p: string): Promise<boolean> {
  return new Promise((resolve) => {
    fs.access(p, constants.F_OK, (err) => {
      if (err) resolve(false);
      else resolve(true);
    });
  });
}

export async function hasFileId(fileId: string): Promise<boolean> {
  return new Promise((resolve) => {
    fs.access(
      path.join(config.express.MULTER_BASE_PATH, fileId),
      constants.F_OK,
      (err) => {
        if (err) resolve(false);
        else resolve(true);
      }
    );
  });
}

export async function rmdir(folderPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.rm(folderPath, { recursive: true, force: true }, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

export async function mkdir(folderPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.mkdir(folderPath, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

export async function deleteFile(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

export const isValidFileId: CustomValidator = async (value) => {
  const result = await hasFileId(value);
  if (result) return result;
  throw new Error('FileId is not valid');
};
