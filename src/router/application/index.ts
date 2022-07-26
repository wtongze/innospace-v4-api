import express, { Request } from 'express';
import { body, query } from 'express-validator';
import { isValidFileId } from '../file/utils';
import { ApplicationInfo } from './type';
import Application from '@src/database/Application';
import Position from '@src/database/Position';
import Project from '@src/database/Project';
import { checkSignedIn, validator } from '@src/middleware';
import { ApplicationStatus, ResponseWithStatus, ResultStatus } from '@src/type';

const ApplicationRouter = express.Router();

ApplicationRouter.get(
  '/',
  checkSignedIn,
  query('id').notEmpty(),
  validator,
  async (
    req: Request<{}, {}, {}, { id: string }>,
    res: ResponseWithStatus<ApplicationInfo>
  ) => {
    const application = await Application.findByPk(req.query.id);
    if (application !== null) {
      const project = (await Project.findByPk(application.project))!;
      const position = (await Position.findByPk(application.position))!;
      if (
        (project.owner === req.user!.id &&
          application.status !== ApplicationStatus.WITHDRAWN) ||
        application.owner === req.user!.id
      ) {
        if (
          project.owner === req.user!.id &&
          application.status === ApplicationStatus.SUBMITTED
        ) {
          application.status = ApplicationStatus.REVIEWED;
          application.reviewedAt = new Date();
          await application.save();
        }
        res.json({
          status: ResultStatus.OK,
          result: {
            id: application.id,
            owner: application.owner,
            name: application.name,
            email: application.email,
            resume: application.resume,
            status: application.status,
            submittedAt: application.submittedAt,
            reviewedAt: application.reviewedAt,
            acceptedAt: application.acceptedAt,
            rejectedAt: application.rejectedAt,
            withdrawnAt: application.withdrawnAt,
            project: {
              id: project.id,
              name: project.name,
              avatar: project.avatar,
              summary: project.summary,
              fields: project.fields,
            },
            position: {
              id: position.id,
              title: position.title,
              type: position.type,
              skills: position.skills,
              views: position.views,
            },
          },
        });
      } else {
        res.status(403).json({
          status: ResultStatus.ERROR,
          error: 'Forbidden',
        });
      }
    } else {
      res.status(404).json({
        status: ResultStatus.ERROR,
        error: 'Application not found',
      });
    }
  }
);

ApplicationRouter.post(
  '/',
  checkSignedIn,
  body('project').notEmpty().toInt(),
  body('position').isInt().toInt(),
  body('name').notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('resume').custom(isValidFileId),
  validator,
  async (
    req: Request<
      {},
      {},
      {
        project: number;
        position: number;
        name: string;
        email: string;
        resume: string;
      },
      {}
    >,
    res: ResponseWithStatus<{ id: number }>
  ) => {
    const { project, position, name, email, resume } = req.body;
    const application = await Application.create({
      project,
      position,
      name,
      email,
      resume,
      owner: req.user!.id,
      submittedAt: new Date(),
    });
    res.json({
      status: ResultStatus.OK,
      result: {
        id: application.id,
      },
    });
  }
);

ApplicationRouter.patch(
  '/',
  checkSignedIn,
  body('id').isInt().toInt(),
  body('status').custom((v) => Object.values(ApplicationStatus).includes(v)),
  validator,
  async (
    req: Request<{}, {}, { id: number; status: ApplicationStatus }>,
    res: ResponseWithStatus
  ) => {
    const { id, status } = req.body;
    const application = await Application.findByPk(id);
    if (application) {
      const project = (await Project.findByPk(application.project))!;
      if (project.owner === req.user!.id) {
        if (
          application.status === ApplicationStatus.REVIEWED &&
          status === ApplicationStatus.ACCEPTED
        ) {
          application.status = ApplicationStatus.ACCEPTED;
          application.acceptedAt = new Date();
          await application.save();
          res.json({
            status: ResultStatus.OK,
          });
        } else if (
          application.status === ApplicationStatus.REVIEWED &&
          status === ApplicationStatus.REJECTED
        ) {
          application.status = ApplicationStatus.REJECTED;
          application.rejectedAt = new Date();
          await application.save();
          res.json({
            status: ResultStatus.OK,
          });
        } else {
          res.status(403).json({
            status: ResultStatus.ERROR,
            error: 'Forbidden',
          });
        }
      } else if (application.owner === req.user!.id) {
        if (
          application.status === ApplicationStatus.SUBMITTED &&
          status === ApplicationStatus.WITHDRAWN
        ) {
          application.status = ApplicationStatus.WITHDRAWN;
          application.withdrawnAt = new Date();
          await application.save();
          res.json({
            status: ResultStatus.OK,
          });
        } else {
          res.status(403).json({
            status: ResultStatus.ERROR,
            error: 'Forbidden',
          });
        }
      } else {
        res.status(403).json({
          status: ResultStatus.ERROR,
          error: 'Forbidden',
        });
      }
    } else {
      res.status(404).json({
        status: ResultStatus.ERROR,
        error: 'Application not found',
      });
    }
  }
);

ApplicationRouter.delete(
  '/',
  checkSignedIn,
  body('id').isInt().toInt(),
  validator,
  async (req: Request<{}, {}, { id: number }, {}>, res: ResponseWithStatus) => {
    const application = await Application.findByPk(req.body.id);
    if (application) {
      if (application.owner === req.user!.id) {
        if (application.status === ApplicationStatus.WITHDRAWN) {
          await application.destroy();
          res.json({
            status: ResultStatus.OK,
          });
        } else {
          res.status(400).json({
            status: ResultStatus.ERROR,
            error: 'Application has not been withdrown',
          });
        }
      } else {
        res.status(403).json({
          status: ResultStatus.ERROR,
          error: 'Forbidden',
        });
      }
    } else {
      res.status(404).json({
        status: ResultStatus.ERROR,
        error: 'Application not found',
      });
    }
  }
);

export default ApplicationRouter;
