import 'tsconfig-paths/register';
import path from 'path';
import Application from '@src/database/Application';
import Position from '@src/database/Position';
import Project from '@src/database/Project';
import User from '@src/database/User';
import { rmdir, mkdir } from '@src/router/file/utils';

async function setup() {
  await User.sync({ force: true });
  await Project.sync({ force: true });
  await Application.sync({ force: true });
  await Position.sync({ force: true });
  await rmdir(path.join(__dirname, '../upload'));
  await mkdir(path.join(__dirname, '../upload'));
}

export default setup;
