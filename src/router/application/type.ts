import { CorePosition } from '../position/type';
import { CoreProject } from '../project/type';
import Application from '@src/database/Application';

export type ApplicationInfo = Pick<
  Application,
  | 'id'
  | 'owner'
  | 'name'
  | 'email'
  | 'resume'
  | 'status'
  | 'submittedAt'
  | 'reviewedAt'
  | 'acceptedAt'
  | 'rejectedAt'
  | 'withdrawnAt'
> & {
  project: CoreProject;
  position: CorePosition;
};
