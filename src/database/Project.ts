import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import sequelize from '.';

class Project extends Model<
  InferAttributes<Project>,
  InferCreationAttributes<Project>
> {
  /**
   * Project's id
   * @example
   * 123
   */
  declare id: CreationOptional<number>;

  /**
   * Project's name
   * @example
   * "InnoSpace"
   */
  declare name: string;

  /**
   * File id of project's avatar
   * @example
   * "abcdef"
   */
  declare avatar: string | null;

  /**
   * Project's summary
   * @example
   * "This is a sample summary"
   */
  declare summary: string;

  /**
   * Project's description in CommonMark
   * @example
   * "> This is a *sample* project."
   */
  declare description: string;

  /**
   * Fields related to the project
   * @example
   * ["Software", "Music"]
   */
  declare fields: CreationOptional<string[]>;

  /**
   * Project's view count
   * @example
   * 20
   */
  declare views: CreationOptional<number>;

  /**
   * Name of project's contact
   * @example
   * "John Doe"
   */
  declare contactName: string;

  /**
   * Email of project's contact
   * @example
   * "john@example.com"
   */
  declare contactEmail: string;

  /**
   * Project's website address
   * @example
   * "https://example.com"
   */
  declare website: string | null;

  /**
   * Id of project's owner
   * @example
   * 123
   */
  declare owner: number;

  /**
   * Whether the project should display to users other
   * other than the owner and users who is related to
   * the project
   */
  declare public: boolean;

  /**
   * Project's post time
   */
  declare postedAt: Date;
}

Project.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    avatar: DataTypes.TEXT,
    summary: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    fields: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    views: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    contactName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    contactEmail: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    website: DataTypes.TEXT,
    owner: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    public: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    postedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  { sequelize, createdAt: false, updatedAt: false }
);

export default Project;
