import { Pet } from '../models/Pet.js'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { IRequestWithUser } from '../types/RequestWithUser.js'
import { ITokenPayLoad } from '../types/TokenPayLoad.js'
import { getToken } from '../helpers/get-token.js'
import { User } from '../models/User.js'


export class PetController{

    static async create(req: IRequestWithUser, res: Response){

        const {name, age, weight, color} = req.body

        if(!name){
            return res.status(422).json({message: 'Name is required.'})
        }
        if(!age){
            return res.status(422).json({message: 'Age is required.'})
        }
        if(!weight){
            return res.status(422).json({message: 'Weight is required.'})
        }
        if(!color){
            return res.status(422).json({message: 'Color is required.'})
        }

        const tokenUserId = (req.user as ITokenPayLoad).id

        const user = await User.findById(tokenUserId)

        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }
    
        const pet = new Pet({
            name,
            age,
            weight,
            color,
            user:{
                _id: user._id,
                name: user.name,
                phone: user.phone
            }
        })

        try{
            const newPet = await pet.save()
            res.status(201).json({message: 'Pet created with success.', newPet})
        } catch (error){
            if(error instanceof Error){
                return res.status(500).json({error: error.message})
            }
            res.status(500).json({error: 'Unknown error.'})
        }

    }

}