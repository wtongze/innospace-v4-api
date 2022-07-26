import app from './app';
import config from './config';
import sequelize from './database';
import { hasPath, mkdir, rmdir } from './router/file/utils';

const port = 4000;
const uploadPath = config.express.MULTER_BASE_PATH;

(async () => {
  await sequelize.sync({ force: true });
  const exist = await hasPath(uploadPath);
  if (exist) {
    await rmdir(uploadPath);
  }
  await mkdir(uploadPath);
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
})();
