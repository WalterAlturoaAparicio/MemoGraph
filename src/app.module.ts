import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { User } from './user/user.entity'
import { DatabaseModule } from './database/database.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User],
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
