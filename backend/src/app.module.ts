import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FoodEntriesModule } from './food-entries/food-entries.module';
import { MacroGoalsModule } from './macro-goals/macro-goals.module';

@Module({
  imports: [
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
