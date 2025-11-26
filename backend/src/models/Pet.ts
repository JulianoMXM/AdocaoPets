import {Schema, model, Document, Types} from 'mongoose'

export interface IPet extends Document{

    name: string,
    age: number,
    weight: number,
    color: string,
    available: boolean,
    user:{
        _id: Types.ObjectId,
        name: string,
        phone: string
    },
    adopter?: {
        _id: Types.ObjectId,
        name: string,
        phone: string
    } | null,
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
            type: new Schema({
                _id: {
                type: Schema.Types.ObjectId,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            phone: {
                type: String,
                required: true  
            },
            }, {_id: false}), //Don't create a new ID
            required: true
        },
        adopter: {
            type: new Schema({
                _id: {
                type: Schema.Types.ObjectId,
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
            }, {_id: false}) //Don't create a new ID
        },
    }, 
    { timestamps: true }
);

export const Pet = model<IPet>('Pet', petSchema)