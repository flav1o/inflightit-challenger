import * as mongoose from 'mongoose';

export const QueueSchema = new mongoose.Schema({
    name: String,
    priority: Number
})