import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Customer } from "src/interfaces/customer.interface";
import { NextCustomer } from "src/interfaces/nextCustomer.interface";
import { Result } from "src/interfaces/result.interface";
import { randomBytes } from 'crypto';
import { Reset } from "src/interfaces/reset.interface";
import { ConfirmReset } from "src/interfaces/confirmReset";

@Injectable()
export class QueueService {
    constructor(@InjectModel('Customer') private queueModel: Model<Customer>) { }

    private _hash;

    async insertCustomer(data: Customer): Promise<Result> {
        //Verify possible errors
        if (!data.name) return { result: 'Missing Name' };
        if (!data.priority) return { result: 'Missing priority' };
        if (data.priority < 0 || data.priority > 10) return { result: 'Priority value must be between 0-10' };

        const customer = new this.queueModel(data);
        await customer.save();

        return { result: true };
    }

    async nextCustomer(): Promise<NextCustomer> {
        const result = await this.queueModel.findOne({}, { 'name': true, 'priority': true }).sort({ 'priority': 'desc' });

        if (!result) return { result: null };
        this.deleteCustomer(result._id);

        return { result: { name: result.name, priority: result.priority } };
    }

    async deleteCustomer(customerID) {
        return await this.queueModel.findByIdAndRemove(customerID);
    }

    //Generates the hash and saves it on the _hash variable
    askReset(): Reset {
        const generatedHash: string = randomBytes(32).toString('hex').toUpperCase();
        this._hash = generatedHash;

        return { code: this._hash };
    }

    //The code must be the same as the value stored in the hash variable
    async confirmReset(code: string): Promise<ConfirmReset> {
        if (code !== this._hash) return { result: false };

        const allUsers = await this.queueModel.find();

        //After many researchs and trys with the .deleteMany({}), drop(), etc. nothing worked.
        //I'm not sure if this is the correct way to remove the data from the db (BUT IT WORKS!)
        allUsers.forEach(async x => await this.queueModel.findByIdAndRemove(x._id));

        //Resets hash after use
        this._hash = "";

        return { result: true };
    }
}