import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import sequelize from '.';
import { ApplicationStatus } from '@src/type';

class Application extends Model<
  InferAttributes<Application>,
  InferCreationAttributes<Application>
> {
  /**
   * Application's id
   * @example
   * 10
   */
  declare id: CreationOptional<number>;

  /**
   * Id of project which application belongs to
   * @example
   * 123
   */
  declare project: number;

  /**
   * Id of position which application belongs to
   * @example
   * 10
   */
  declare position: number;

  /**
   * Id of user which application belongs to
   * @example
   * 123
   */
  declare owner: number;

  /**
   * User's name
   * @example
   * "John Doe"
   */
  declare name: string;

  /**
   * User's email
   * @example
   * "john@example.com"
   */
  declare email: string;

  /**
   * File id of user's resume
   * @example
   * "abcdef"
   */
  declare resume: string;

  /**
   * Application status
   */
  declare status: CreationOptional<ApplicationStatus>;

  /**
   * Date object to represents when application has been submitted
   */
  declare submittedAt: Date;

  /**
   * Date object to represents when application has been reviewed
   */
  declare reviewedAt: Date | null;

  /**
   * Date object to represents when application has been accepted
   */
  declare acceptedAt: Date | null;

  /**
   * Date object to represents when application has been rejected
   */
  declare rejectedAt: Date | null;

  /**
   * Date object to represents when application has been withdrawn
   */
  declare withdrawnAt: Date | null;
}

Application.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    project: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    owner: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    resume: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ApplicationStatus)),
      allowNull: false,
      defaultValue: ApplicationStatus.SUBMITTED,
    },
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    reviewedAt: DataTypes.DATE,
    acceptedAt: DataTypes.DATE,
    rejectedAt: DataTypes.DATE,
    withdrawnAt: DataTypes.DATE,
  },
  { sequelize }
);

export default Application;
