import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ConfirmReset } from "src/interfaces/confirmReset";
import { NextCustomer } from "src/interfaces/nextCustomer.interface";
import { Reset } from "src/interfaces/reset.interface";
import { Result } from "src/interfaces/result.interface";
import { CreateCustomer } from "./classes/create-customer";
import { QueueService } from "./queue.service";

@Controller('api/v0')
export class QueueController {
    constructor(private _queue: QueueService) {}

    @Post('addCustomer')
    async insertNewCustomer(
        @Body() createCustomer: CreateCustomer
    ): Promise<Result> {
        return await this._queue.insertCustomer(createCustomer);
    }

    @Get('getNextCustomer')
    async findNext(): Promise<NextCustomer> {
        return this._queue.nextCustomer();
    }

    @Get('ask-to-reset')
    askReset(): Reset { 
        return this._queue.askReset();
    }

    @Get('reset')
    async generateHash(@Query() query: any): Promise<ConfirmReset>  {
        return await this._queue.confirmReset(query.code);
    }
}