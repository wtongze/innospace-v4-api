import path from 'path';
import express, { Request, Response } from 'express';
import { body, query } from 'express-validator';
import multer from 'multer';
import { isValidFileId, rmdir } from './utils';
import config from '@src/config';
import Application from '@src/database/Application';
import Project from '@src/database/Project';
import { validator, checkSignedIn } from '@src/middleware';
import { ApplicationStatus, ResponseWithStatus, ResultStatus } from '@src/type';

const FileRouter = express.Router();
const basePath = config.express.MULTER_BASE_PATH;

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, basePath);
  },
  filename(req, file, cb) {
    const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniquePrefix}-${file.originalname}`);
  },
});

const upload = multer({ storage });
const allowedMIME = [
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'application/pdf',
];

FileRouter.post(
  '/',
  checkSignedIn,
  upload.single('file'),
  async (req: Request, res: ResponseWithStatus<{ id: string }>) => {
    if (req.file && allowedMIME.includes(req.file.mimetype)) {
      res.json({
        status: ResultStatus.OK,
        result: {
          id: req.file.filename,
        },
      });
    } else {
      res.status(400).json({
        status: ResultStatus.ERROR,
        error: "Can't upload file",
      });
    }
  }
);

FileRouter.get(
  '/',
  checkSignedIn,
  query('id').custom(isValidFileId),
  validator,
  async (req: Request<{}, {}, {}, { id: string }>, res: Response) => {
    const { id: fileId } = req.query;
    const { id: userId } = req.user!;
    const project = await Project.findOne({
      where: {
        avatar: fileId,
      },
    });
    const application = await Application.findOne({
      where: {
        resume: fileId,
      },
    });
    const filePath = path.join(basePath, fileId);
    if (project) {
      if (project.owner === userId || project.public) {
        res.sendFile(filePath);
      } else {
        res.sendStatus(403);
      }
    } else if (application) {
      const projectByApplication = (await Project.findByPk(
        application.project
      ))!;
      if (
        application.owner === userId ||
        (application.status !== ApplicationStatus.WITHDRAWN &&
          projectByApplication.owner === userId)
      ) {
        res.sendFile(filePath);
      } else {
        res.sendStatus(403);
      }
    } else {
      res.sendFile(filePath);
    }
  }
);

FileRouter.delete(
  '/',
  checkSignedIn,
  body('id').custom(isValidFileId),
  validator,
  async (req: Request<{}, {}, { id: string }, {}>, res: ResponseWithStatus) => {
    const { id: fileId } = req.body;
    const { id: userId } = req.user!;
    const filePath = path.join(basePath, fileId);
    const project = await Project.findOne({
      where: {
        avatar: fileId,
      },
    });
    const application = await Application.findOne({
      where: {
        resume: fileId,
      },
    });
    if (project) {
      if (project.owner === userId) {
        await rmdir(filePath);
        project.avatar = null;
        await project.save();
        res.json({
          status: ResultStatus.OK,
        });
      } else {
        res.status(403).json({
          status: ResultStatus.ERROR,
          error: 'Forbidden',
        });
      }
    } else if (application) {
      if (application.owner === userId) {
        if (application.status === ApplicationStatus.WITHDRAWN) {
          await rmdir(filePath);
          await application.destroy();
          res.json({
            status: ResultStatus.OK,
          });
        } else {
          res.status(400).json({
            status: ResultStatus.ERROR,
            error: 'Application status is not withdrawn',
          });
        }
      } else {
        res.status(403).json({
          status: ResultStatus.ERROR,
          error: 'Forbidden',
        });
      }
    } else {
      await rmdir(filePath);
      res.json({
        status: ResultStatus.OK,
      });
    }
  }
);

export default FileRouter;
