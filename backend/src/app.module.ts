import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FoodEntriesModule } from './food-entries/food-entries.module';
import { MacroGoalsModule } from './macro-goals/macro-goals.module';
import { validate } from './config/env.validation';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    FoodEntriesModule,
    MacroGoalsModule,
  ],
})
export class AppModule {}
