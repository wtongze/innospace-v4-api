import express, { Request } from 'express';
import { body, query } from 'express-validator';
import { PositionInfo } from './type';
import Application from '@src/database/Application';
import Position from '@src/database/Position';
import Project from '@src/database/Project';
import { checkSignedIn, validator } from '@src/middleware';
import { ResponseWithStatus, ResultStatus } from '@src/type';

const PositionRouter = express.Router();

PositionRouter.get(
  '/',
  checkSignedIn,
  query('id').isInt(),
  validator,
  async (
    req: Request<{}, {}, {}, { id: string }>,
    res: ResponseWithStatus<PositionInfo>
  ) => {
    const position = await Position.findByPk(req.query.id);
    const userId = req.user!.id;

    if (position) {
      const project = await Project.findByPk(position.project);
      const application = await Application.findOne({
        where: {
          position: position.id,
          owner: userId,
        },
      });
      if (
        (project && project.owner === userId) ||
        application !== null ||
        position.public
      ) {
        position.views += 1;
        await position.save();
        res.json({
          status: ResultStatus.OK,
          result: {
            id: position.id,
            title: position.title,
            type: position.type,
            description: position.description,
            requirement: position.requirement,
            preference: position.preference,
            skills: position.skills,
            project: position.project,
            views: position.views,
            public: position.public,
            postedAt: position.postedAt,
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
        error: 'Position not found',
      });
    }
  }
);

PositionRouter.post(
  '/',
  checkSignedIn,
  body('title').isLength({ min: 5 }),
  body('description').isLength({ min: 50 }),
  body('requirement').isLength({ min: 50 }),
  body('preference').isLength({ min: 50 }),
  body('skills').isArray().toArray(),
  body('project').isInt().toInt(),
  body('public').isBoolean().toBoolean(),
  validator,
  async (
    req: Request<
      {},
      {},
      {
        title: string;
        description: string;
        requirement: string;
        preference: string;
        skills: string[];
        project: number;
        public: boolean;
      },
      {}
    >,
    res: ResponseWithStatus<{ id: number }>
  ) => {
    const { project } = req.body;
    const existingProject = await Project.findByPk(project);
    if (existingProject) {
      const userId = req.user!.id;
      if (userId === existingProject.owner) {
        const position = await Position.create({
          ...req.body,
          postedAt: new Date(),
        });
        res.json({
          status: ResultStatus.OK,
          result: {
            id: position.id,
          },
        });
      } else {
        res.status(403).json({
          status: ResultStatus.ERROR,
          error: 'Forbidden',
        });
      }
    } else {
      res.status(400).json({
        status: ResultStatus.ERROR,
        error: 'Associated project not found',
      });
    }
  }
);

PositionRouter.patch(
  '/',
  checkSignedIn,
  body('id').isInt().toInt(),
  body('title').isLength({ min: 5 }).optional(),
  body('description').isLength({ min: 50 }).optional(),
  body('requirement').isLength({ min: 50 }).optional(),
  body('preference').isLength({ min: 50 }).optional(),
  body('skills').isArray().toArray().optional(),
  body('public').isBoolean().toBoolean().optional(),
  validator,
  async (
    req: Request<
      {},
      {},
      {
        id: number;
        title?: string;
        description?: string;
        requirement?: string;
        preference?: string;
        skills?: string[];
        public?: boolean;
      },
      {}
    >,
    res: ResponseWithStatus
  ) => {
    const position = await Position.findByPk(req.body.id);
    if (position !== null) {
      const project = (await Project.findByPk(position.project))!;
      if (project.owner === req.user!.id) {
        const {
          title,
          description,
          requirement,
          preference,
          skills,
          public: isPublic,
        } = req.body;
        if (title) position.title = title;
        if (description) position.description = description;
        if (requirement) position.requirement = requirement;
        if (preference) position.preference = preference;
        if (skills !== undefined) position.skills = skills;
        if (isPublic !== undefined) position.public = isPublic;
        await position.save();
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
      res.status(404).json({
        status: ResultStatus.ERROR,
        error: 'Position not found',
      });
    }
  }
);

PositionRouter.delete(
  '/',
  checkSignedIn,
  body('id').isInt().toInt(),
  validator,
  async (
    req: Request<
      {},
      {},
      {
        id: number;
      },
      {}
    >,
    res: ResponseWithStatus
  ) => {
    const position = await Position.findByPk(req.body.id);
    if (position !== null) {
      const project = (await Project.findByPk(position.project))!;
      if (project.owner === req.user!.id) {
        await position.destroy();
        const applications = await Application.findAll({
          where: {
            position: position.id,
          },
        });
        const deleteTasks = applications.map(async (t) => {
          await t.destroy();
        });
        await Promise.all(deleteTasks);
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
      res.status(404).json({
        status: ResultStatus.ERROR,
        error: 'Position not found',
      });
    }
  }
);

export default PositionRouter;
