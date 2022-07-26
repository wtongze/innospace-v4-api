import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Model,
} from 'sequelize';
import sequelize from '.';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  /**
   * User ID
   * @example 123
   */
  declare id: CreationOptional<number>;

  /**
   * User full name
   * @example "John Doe"
   */
  declare name: string;

  /**
   * User password in PBKDF2
   */
  declare password: string | null;

  /**
   * Salt for User password
   */
  declare salt: string | null;

  /**
   * User's description
   * @example "MSCS Student from UC Santa Cruz"
   */
  declare description: string | null;

  /**
   * User's email
   * @example "john@example.com"
   */
  declare email: string;

  /**
   * Fields that user is interested in
   * @example
   * ["Software", "Music"]
   */
  declare fields: CreationOptional<string[]>;

  /**
   * Skills that user has
   * @example
   * ["React.js", "TypeScript"]
   */
  declare skills: CreationOptional<string[]>;

  /**
   * Google account id associated with user if user is
   * logged in with Google through OAuth2
   * @example
   * "1234567890"
   */
  declare googleId: string | null;
}

User.init(
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
    password: DataTypes.TEXT,
    salt: DataTypes.TEXT,
    description: DataTypes.TEXT,
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    fields: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    skills: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    googleId: DataTypes.TEXT,
  },
  { sequelize }
);

export default User;
