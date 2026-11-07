const { existsSync } = require('node:fs')
const { join } = require('node:path')
const { Sequelize, DataTypes } = require('sequelize')

const envFile = join(__dirname, '.env')
if (existsSync(envFile)) process.loadEnvFile(envFile)

const database = process.env.DB_NAME || 'roadtripper'
const connection = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3307),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
}
const sequelize = new Sequelize(database, connection.user, connection.password, {
  host: connection.host,
  port: connection.port,
  dialect: 'mysql',
  logging: false,
})

const id = { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true }
const requiredString = { type: DataTypes.STRING, allowNull: false }

const User = sequelize.define('User', {
  id_user: { ...id },
  email: { ...requiredString, unique: true, validate: { isEmail: true } },
  password_hash: { ...requiredString },
}, { tableName: 'users', timestamps: false })

const Trip = sequelize.define('Trip', {
  id_trip: { ...id },
  name: { ...requiredString },
  trip_type: DataTypes.STRING,
  destination: DataTypes.STRING,
  start_date: DataTypes.DATEONLY,
  end_date: DataTypes.DATEONLY,
  travelers: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 1 },
  budget: DataTypes.DECIMAL(12, 2),
  transport: DataTypes.STRING,
  visibility: DataTypes.STRING,
  description: DataTypes.TEXT,
}, { tableName: 'road_trips', timestamps: false })

const Category = sequelize.define('Category', {
  id_category: { ...id },
  name: { ...requiredString, unique: true },
  color: { type: DataTypes.STRING(7), allowNull: false },
}, { tableName: 'categories', timestamps: false })

const Task = sequelize.define('Task', {
  id_todo: { ...id },
  title: { ...requiredString },
  status: {
    type: DataTypes.ENUM('To Do', 'Doing', 'Done'),
    allowNull: false,
    defaultValue: 'To Do',
  },
}, { tableName: 'to_dos', timestamps: false })

Trip.belongsTo(User, { foreignKey: { name: 'id_user', allowNull: false }, onDelete: 'CASCADE' })
Task.belongsTo(Trip, { foreignKey: { name: 'id_trip', allowNull: false }, onDelete: 'CASCADE' })
Task.belongsTo(Category, { foreignKey: 'id_category', onDelete: 'SET NULL' })

module.exports = { sequelize, database, connection, User, Trip, Category, Task }
