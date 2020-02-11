import { Sequelize } from 'sequelize-typescript'

import { PinoLogger } from 'nestjs-pino'
import { Comment } from '../comments/comment.entity'

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async (logger: PinoLogger) => {
      logger.setContext('Sequelize')

      const db: Sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        logging: logger.info.bind(logger),
        benchmark: true,
        retry: {
          max: 3
        }
      })

      db.addModels([Comment])

      await db.sync()

      return db
    },
    inject: [PinoLogger]
  }
]
