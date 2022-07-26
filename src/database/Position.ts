import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import sequelize from '.';

enum PositionType {
  UNPAID_VOLUNTEER = 'UNPAID_VOLUNTEER',
}

class Position extends Model<
  InferAttributes<Position>,
  InferCreationAttributes<Position>
> {
  /**
   * Position's id
   * @example
   * 10
   */
  declare id: CreationOptional<number>;

  /**
   * Position's title
   * @example
   * "Front-end Developer"
   */
  declare title: string;

  /**
   * Position's type
   */
  declare type: CreationOptional<PositionType>;

  /**
   * Position's description in CommonMark
   * @example
   * "> This is an *example*."
   */
  declare description: string;

  /**
   * Position's requirement in CommonMark
   * @example
   * "> This is an *example*."
   */
  declare requirement: string;

  /**
   * Position's preference in CommonMark
   * @example
   * "> This is an *example*."
   */
  declare preference: string;

  /**
   * Skills that position needs
   * @example
   * ["React.js", "TypeScript"]
   */
  declare skills: CreationOptional<string[]>;

  /**
   * Id of project which current position belongs to
   * @example
   * 123
   */
  declare project: number;

  /**
   * Position's view count
   * @example
   * 10
   */
  declare views: CreationOptional<number>;

  /**
   * Whether the position should display to users other
   * other than the owner and users who is related to
   * the position
   */
  declare public: boolean;

  /**
   * Position's post time
   */
  declare postedAt: Date;
}

Position.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(PositionType)),
      allowNull: false,
      defaultValue: PositionType.UNPAID_VOLUNTEER,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    requirement: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    preference: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    skills: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    project: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    views: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    public: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    postedAt: { type: DataTypes.DATE, allowNull: false },
  },
  { sequelize }
);

export default Position;
