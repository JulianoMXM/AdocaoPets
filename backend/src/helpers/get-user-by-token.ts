import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { Response } from 'express'
import { ITokenPayLoad } from '../types/TokenPayLoad.js'

const JWT_TOKEN = process.env.JWT_TOKEN || ""

//Get user by token
export const getUserByToken = async (token: string) => {

    if(!token){
        return null
    }

    const decoded = jwt.verify(token, JWT_TOKEN) as ITokenPayLoad

    const userId = decoded.id

    const user = await User.findById(userId)
    
    return user
}