import express, { Request } from 'express';
import { body, query } from 'express-validator';
import Fuse from 'fuse.js';
import { Op } from 'sequelize';
import { isValidFileId } from '../file/utils';
import {
  Pagination,
  BasicProject,
  SearchQuery,
  JoinedProject,
  PostedProject,
  ProjectInfo,
} from './type';
import Application from '@src/database/Application';
import Position from '@src/database/Position';
import Project from '@src/database/Project';
import { checkSignedIn, validator } from '@src/middleware';
import { ApplicationStatus, ResponseWithStatus, ResultStatus } from '@src/type';

const ProjectRouter = express.Router();

const paginationQueryCheck = [
  query('limit').isInt().optional(),
  query('offset').isInt().optional(),
];

ProjectRouter.get(
  '/trending',
  checkSignedIn,
  paginationQueryCheck,
  validator,
  async (
    req: Request<{}, {}, {}, Pagination>,
    res: ResponseWithStatus<BasicProject[]>
  ) => {
    const { limit = 10, offset = 0 } = req.query;
    const rawProjcts = await Project.findAll({
      order: [['views', 'DESC']],
      limit,
      offset,
    });
    const projects = await Promise.all(
      rawProjcts.map(async (project): Promise<BasicProject> => {
        const openPositions = await Position.count({
          where: {
            project: project.id,
          },
        });
        return {
          id: project.id,
          name: project.name,
          avatar: project.avatar,
          summary: project.summary,
          fields: project.fields,
          views: project.views,
          contactName: project.contactName,
          contactEmail: project.contactEmail,
          description: project.description,
          website: project.website,
          openPositions,
        };
      })
    );
    res.json({
      status: ResultStatus.OK,
      result: projects,
    });
  }
);

ProjectRouter.get(
  '/personalized',
  checkSignedIn,
  paginationQueryCheck,
  validator,
  async (
    req: Request<{}, {}, {}, Pagination>,
    res: ResponseWithStatus<BasicProject[]>
  ) => {
    const { limit = 10, offset = 0 } = req.query;
    const rawProjcts = await Project.findAll({
      limit,
      offset,
    });
    const projects = await Promise.all(
      rawProjcts.map(async (project): Promise<BasicProject> => {
        const openPositions = await Position.count({
          where: {
            project: project.id,
          },
        });
        return {
          id: project.id,
          name: project.name,
          avatar: project.avatar,
          summary: project.summary,
          fields: project.fields,
          views: project.views,
          contactName: project.contactName,
          contactEmail: project.contactEmail,
          description: project.description,
          website: project.website,
          openPositions,
        };
      })
    );
    res.json({
      status: ResultStatus.OK,
      result: projects,
    });
  }
);

ProjectRouter.get(
  '/search',
  checkSignedIn,
  paginationQueryCheck,
  query('keyword').notEmpty(),
  validator,
  async (
    req: Request<{}, {}, {}, SearchQuery>,
    res: ResponseWithStatus<BasicProject[]>
  ) => {
    const { limit = 10, offset = 0, keyword } = req.query;
    const rawProjcts = await Project.findAll();
    const fuse = new Fuse(rawProjcts, {
      keys: ['name', 'summary', 'description'],
    });
    const result = fuse.search(keyword).slice(offset, offset + limit);
    const projects = await Promise.all(
      result.map(async ({ item: project }): Promise<BasicProject> => {
        const openPositions = await Position.count({
          where: {
            project: project.id,
          },
        });
        return {
          id: project.id,
          name: project.name,
          avatar: project.avatar,
          summary: project.summary,
          fields: project.fields,
          views: project.views,
          contactName: project.contactName,
          contactEmail: project.contactEmail,
          description: project.description,
          website: project.website,
          openPositions,
        };
      })
    );
    res.json({
      status: ResultStatus.OK,
      result: projects,
    });
  }
);

ProjectRouter.get(
  '/joined',
  checkSignedIn,
  paginationQueryCheck,
  validator,
  async (
    req: Request<{}, {}, {}, Pagination>,
    res: ResponseWithStatus<JoinedProject[]>
  ) => {
    const { limit = 10, offset = 0 } = req.query;
    const applications = await Application.findAll({
      where: {
        owner: req.user!.id,
        status: ApplicationStatus.ACCEPTED,
        acceptedAt: {
          [Op.not]: null,
        },
      },
      order: [['acceptedAt', 'DESC']],
      limit,
      offset,
    });
    const coreProjects = await Promise.all(
      applications.map(async (application): Promise<JoinedProject> => {
        const project = (await Project.findByPk(application.project))!;
        return {
          id: project.id,
          name: project.name,
          avatar: project.avatar,
          summary: project.summary,
          fields: project.fields,
          joinedAt: application.acceptedAt!.toISOString(),
        };
      })
    );
    res.json({
      status: ResultStatus.OK,
      result: coreProjects.filter((i): i is JoinedProject => i !== null),
    });
  }
);

ProjectRouter.get(
  '/posted',
  checkSignedIn,
  paginationQueryCheck,
  validator,
  async (
    req: Request<{}, {}, {}, Pagination>,
    res: ResponseWithStatus<PostedProject[]>
  ) => {
    const { limit = 10, offset = 0 } = req.query;
    const projects = await Project.findAll({
      where: {
        owner: req.user!.id,
      },
      order: [['postedAt', 'DESC']],
      limit,
      offset,
    });
    res.json({
      status: ResultStatus.OK,
      result: projects.map((i) => ({
        id: i.id,
        name: i.name,
        avatar: i.avatar,
        summary: i.summary,
        fields: i.fields,
        postedAt: i.postedAt!.toISOString(),
      })),
    });
  }
);

ProjectRouter.get(
  '/',
  checkSignedIn,
  query('id').isInt(),
  validator,
  async (
    req: Request<{}, {}, {}, { id: string }>,
    res: ResponseWithStatus<ProjectInfo>
  ) => {
    const { id } = req.query;
    const userId = req.user!.id;
    const project = await Project.findByPk(id);
    if (project) {
      const application = await Application.findOne({
        where: {
          project: project.id,
          owner: userId,
        },
      });
      if (project.owner === userId || application !== null || project.public) {
        const positions = await Position.findAll({
          where: {
            project: project.id,
            public: true,
          },
          order: [['postedAt', 'DESC']],
        });
        project.views += 1;
        await project.save();
        res.json({
          status: ResultStatus.OK,
          result: {
            ...project.toJSON(),
            openPositions: positions.length,
            positions: positions.map((i) => ({
              id: i.id,
              title: i.title,
              type: i.type,
              skills: i.skills,
              views: i.views,
              postedAt: i.postedAt!.toISOString(),
            })),
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
        error: 'Project not found',
      });
    }
  }
);

ProjectRouter.post(
  '/',
  checkSignedIn,
  body('name').isLength({ min: 5 }),
  body('avatar').custom(isValidFileId).optional(),
  body('summary').isLength({ min: 10, max: 100 }),
  body('fields').isArray().toArray(),
  body('contactName').isLength({ min: 5 }),
  body('contactEmail').isEmail().normalizeEmail(),
  body('description').isLength({ min: 10 }),
  body('website').isURL().optional(),
  body('public').isBoolean().toBoolean(),
  validator,
  async (
    req: Request<
      {},
      {},
      {
        name: string;
        avatar?: string;
        summary: string;
        description: string;
        fields: string[];
        contactName: string;
        contactEmail: string;
        website?: string;
        public: boolean;
      },
      {}
    >,
    res: ResponseWithStatus<{ id: number }>
  ) => {
    const { id } = await Project.create({
      ...req.body,
      owner: req.user!.id,
      postedAt: new Date(),
    });
    res.json({
      status: ResultStatus.OK,
      result: {
        id,
      },
    });
  }
);

ProjectRouter.patch(
  '/',
  checkSignedIn,
  body('id').isInt().toInt(),
  body('name').isLength({ min: 5 }).optional(),
  body('avatar').optional(),
  body('summary').isLength({ min: 10, max: 100 }).optional(),
  body('fields').isArray().toArray().optional(),
  body('contactName').isLength({ min: 5 }).optional(),
  body('contactEmail').isEmail().normalizeEmail().optional(),
  body('description').isLength({ min: 10 }).optional(),
  body('website').isURL().optional(),
  body('public').isBoolean().toBoolean().optional(),
  validator,
  async (
    req: Request<
      {},
      {},
      {
        id: number;
        name?: string;
        avatar?: string;
        summary?: string;
        description?: string;
        fields?: string[];
        contactName?: string;
        contactEmail?: string;
        website?: string;
        public?: boolean;
      },
      {}
    >,
    res: ResponseWithStatus
  ) => {
    const project = await Project.findByPk(req.body.id);
    if (project !== null) {
      if (project.owner === req.user!.id) {
        const {
          name,
          avatar,
          summary,
          description,
          fields,
          contactName,
          contactEmail,
          website,
          public: isPublic,
        } = req.body;
        if (name) project.name = name;
        if (avatar) project.avatar = avatar;
        if (summary) project.summary = summary;
        if (description) project.description = description;
        if (fields !== undefined) project.fields = fields;
        if (contactName) project.contactName = contactName;
        if (contactEmail) project.contactEmail = contactEmail;
        if (website) project.website = website;
        if (isPublic !== undefined) project.public = isPublic;
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
    } else {
      res.status(404).json({
        status: ResultStatus.ERROR,
        error: 'Project not found',
      });
    }
  }
);

ProjectRouter.delete(
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
    const project = await Project.findByPk(req.body.id);
    if (project !== null) {
      if (project.owner === req.user!.id) {
        await project.destroy();
        const positions = await Position.findAll({
          where: {
            project: project.id,
          },
        });
        const applications = await Application.findAll({
          where: {
            project: project.id,
          },
        });
        const deleteTasks = [...positions, ...applications].map(async (t) => {
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
        error: 'Project not found',
      });
    }
  }
);

export default ProjectRouter;
