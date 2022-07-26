import Position from '@src/database/Position';

export type CorePosition = Pick<
  Position,
  'id' | 'title' | 'type' | 'skills' | 'views'
>;

export type PositionInfo = Pick<
  Position,
  | 'id'
  | 'title'
  | 'type'
  | 'description'
  | 'requirement'
  | 'preference'
  | 'skills'
  | 'project'
  | 'views'
  | 'public'
  | 'postedAt'
>;
