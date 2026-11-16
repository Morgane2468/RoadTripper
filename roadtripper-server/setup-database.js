const mysql = require('mysql2/promise')
const { sequelize, database, connection, Category, User } = require('./database')
const { categories } = require('../roadtripper-front/src/mock/data.json')

async function setup() {
  try {
    const client = await mysql.createConnection(connection)
    try {
      await client.query('CREATE DATABASE IF NOT EXISTS ?? CHARACTER SET utf8mb4', [database])
    } finally {
      await client.end()
    }

    await sequelize.sync()
    const query = sequelize.getQueryInterface()
    const columns = await query.describeTable('users')
    for (const field of ['first_name', 'last_name', 'nickname', 'avatar']) {
      if (!columns[field]) await query.addColumn('users', field, User.getAttributes()[field])
    }
    await sequelize.transaction(async (transaction) => {
      for (const { id_category, ...category } of categories) {
        await Category.findOrCreate({
          where: { name: category.name },
          defaults: { id_category, ...category },
          transaction,
        })
      }
    })
    console.log(`MySQL database ready: ${database}`)
  } catch (error) {
    console.error('Database setup failed:', error.original?.code || error.code || error.message)
    process.exitCode = 1
  } finally {
    await sequelize.close()
  }
}

setup()
