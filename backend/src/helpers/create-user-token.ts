import jwt from 'jsonwebtoken'
import {Request, Response} from 'express'

const JWT_TOKEN = process.env.JWT_TOKEN

export const createUserToken = async (user: any, req: Request, res: Response) =>{

    if(!JWT_TOKEN){
        res.status(500).json({message: 'Erro interno (Token).'})
        return
    }

    const token = jwt.sign({
        name: user.name,
        id: user._id,
    }, JWT_TOKEN)

    res.status(200).json({
        message: 'Autenticação concluída.',
        token: token,
        id: user._id
    })

}