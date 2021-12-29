import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QueueModule } from './queue/queue.module';
import secret from './secret';

@Module({
  imports: [QueueModule, MongooseModule.forRoot(secret.dbURI)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
