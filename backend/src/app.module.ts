import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/entities/user.entity';
import { Category } from './users/entities/category.entity';
import { Event } from './users/entities/event.entity';
import { Reservation } from './users/entities/reservation.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'db',
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      username: process.env.DATABASE_USER || process.env.POSTGRES_USER,
      password: process.env.DATABASE_PASSWORD || process.env.POSTGRES_PASSWORD,
      database: process.env.DATABASE_NAME || process.env.POSTGRES_DB,
      entities: [User, Category, Event, Reservation],
      synchronize: true,
      logging: true,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
