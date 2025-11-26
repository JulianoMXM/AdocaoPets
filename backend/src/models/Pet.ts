import {Schema, model} from 'mongoose'

export interface IPet extends Document{

    name: string,
    age: number,
    weight: number,
    color: string,
    available: boolean,
    user:{
        _id: string,
        name: string,
        phone: string
    },
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
            _id: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            phone: {
                type: String,
                required: true
            }
        },
        adopter: {
            type: Object
        }
    }, 
    { timestamps: true }
);

export const Pet = model<IPet>('Pet', petSchema)