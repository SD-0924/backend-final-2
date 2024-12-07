// Import sequelize refrence
import { sequelize } from "../config/db";

// Import DataTypes from sequelize module
import { DataTypes, Model, Optional } from "sequelize";

// Import bcrypt from bcryptjs to encrypt password
import bcrypt from "bcrypt";


export interface UserAttributes {
  user_id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string ;
  dateOfBirth: Date ;
  password: string;
  address?: string | null;
  profilePicture?: string | null;
  lastPasswordChange?: Date|null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the optional fields for creating a new user
export interface UserCreationAttributes extends Optional<UserAttributes, "user_id" |"lastPasswordChange" | "createdAt" | "updatedAt" |"address"> {}

// Extend Sequelize's Model class
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public user_id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public phone!: string;
  public dateOfBirth!: Date;
  public password!: string;
  public address!: string | null;
  public profilePicture!: string|null;
  public lastPasswordChange!: Date|null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Instance method for validating password
  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
// Define the User model
User.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value: string) {
        const hashedPassword = bcrypt.hashSync(value, 10);
        this.setDataValue("password", hashedPassword);
      },
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull:true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastPasswordChange: {
      type:DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "user",
    timestamps: true,
  }
);

