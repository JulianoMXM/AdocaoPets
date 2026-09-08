import jwt from 'jsonwebtoken'
import {getToken} from '../helpers/get-token.js'
import {Request, Response, NextFunction} from 'express'
import { IRequestWithUser } from '../types/RequestWithUser.js'

const JWT_TOKEN = process.env.JWT_TOKEN || ""

//Middleware to validate token
export const checkToken = (req: IRequestWithUser, res: Response, next: NextFunction) => {

    if(!req.headers.authorization){
        return res.status(401).json({message: 'Not authorized.'})
    }

    const token = getToken(req)

    if(!token){
        return res.status(401).json({message: 'Not authorized.'})
    }

    try{
        const verified = jwt.verify(token, JWT_TOKEN)
        req.user = verified
        next() 
    } catch {
        return res.status(400).json({message: 'Invalid token.'})
    }

}