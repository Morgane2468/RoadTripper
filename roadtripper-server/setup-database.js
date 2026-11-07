const mysql = require('mysql2/promise')
const { sequelize, database, connection, Category } = require('./database')
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
