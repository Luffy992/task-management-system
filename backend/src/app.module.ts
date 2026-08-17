import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [DatabaseModule, TasksModule, AuthModule, ProjectsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
