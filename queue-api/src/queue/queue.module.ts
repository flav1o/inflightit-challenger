import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { QueueController } from "./queue.controller";
import { QueueService } from "./queue.service";
import { QueueSchema } from "./schemas/queues.chema";

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Customer', schema: QueueSchema}])],
    controllers: [QueueController],
    providers: [QueueService]
})

export class QueueModule {}