import type { CorePosition } from '../position/type';
import type Project from '@src/database/Project';

export interface Pagination {
  limit?: number;
  offset?: number;
}

export type BasicProject = Pick<
  Project,
  | 'id'
  | 'name'
  | 'avatar'
  | 'summary'
  | 'description'
  | 'fields'
  | 'views'
  | 'contactName'
  | 'contactEmail'
  | 'website'
> & {
  openPositions: number;
};

export type CoreProject = Pick<
  Project,
  'id' | 'name' | 'avatar' | 'summary' | 'fields'
>;

export interface SearchQuery extends Pagination {
  keyword: string;
}

export type JoinedProject = CoreProject & { joinedAt: string };

export type PostedProject = CoreProject & { postedAt: string };

export type ProjectInfo = Pick<
  Project,
  | 'id'
  | 'name'
  | 'avatar'
  | 'summary'
  | 'description'
  | 'fields'
  | 'views'
  | 'contactName'
  | 'contactEmail'
  | 'website'
  | 'owner'
  | 'public'
  | 'postedAt'
> & {
  openPositions: number;
  positions: ({ postedAt: string } & CorePosition)[];
};
