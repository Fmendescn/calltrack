import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FoodEntriesModule } from './food-entries/food-entries.module';
import { MacroGoalsModule } from './macro-goals/macro-goals.module';
import { validate } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),
    HealthModule,
    AuthModule,
    UsersModule,
    FoodEntriesModule,
    MacroGoalsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
