import {Schema, model} from 'mongoose'

export interface IPet extends Document{

    name: string,
    age: number,
    weight: number,
    color: string,
    available: boolean,
    user: object,
    adopter: object,
    createdAt: Date,
    updatedAt: Date

}

const petSchema = new Schema<IPet>({

        name: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            required: true
        },
        weight: {
            type: Number,
            required: true
        },
        color: {
            type: String,
            required: true
        },
        available: {
            type: Boolean,
            default: true
        },
        user: {
            type: Object
        },
        adopter: {
            type: Object
        }
    }, 
    { timestamps: true }
);

export const Pet = model<IPet>('Pet', petSchema)