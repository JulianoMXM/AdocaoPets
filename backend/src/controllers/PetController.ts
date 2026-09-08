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

    static async getAll(req: Request, res: Response){

        try{
            const pets = await Pet.find().sort('-createdAt')
            res.status(200).json({pets})
        } catch (error) {
            if(error instanceof Error){
                return res.status(500).json({error: error.message})
            }
            res.status(500).json({error: 'Unknown error.'})

        }
    }

    static async getAllUserPets(req: IRequestWithUser, res: Response){

        const tokenUserId = (req.user as ITokenPayLoad).id

        try{
            const user = await User.findById(tokenUserId)

            if(!user){
                return res.status(404).json({message: 'User not found.'})
            }

            const pets = await Pet.find({'user._id': user._id}).sort('-createdAt')
            res.status(200).json({pets})
        } catch (error) {
            if(error instanceof Error){
                return res.status(500).json({error: error.message})
            }
            res.status(500).json({error: 'Unknown error.'})

        }
        
    }

    static async findPetById(req: Request, res: Response){

        const id = req.params.id

        try{
            const pet = await Pet.findById(id)

            if(!pet){
                return res.status(404).json({message: 'Pet not found.'})
            }

            return res.status(200).json({pet})

        } catch (error) {
            if(error instanceof Error){
                return res.status(500).json({error: error.message})
            }
            res.status(500).json({error: 'Unknown error.'})

        }

    }

    static async editPet(req: IRequestWithUser, res: Response){

        const id = req.params.id

        const tokenUserId = (req.user as ITokenPayLoad).id

        const {name, age, weight, color} = req.body

        try{

            const pet = await Pet.findById(id)
            if(!pet){
                return res.status(404).json({message: 'Pet not found.'})
            }

            if(pet.user._id.toString() !== tokenUserId){
                return res.status(401).json({message: 'Not authorized.'})
            }

            if(name){
                pet.name = name
            }
            if(age){
                pet.age = age
            }
            if(weight){
                pet.weight = weight
            }
            if(color){
                pet.color = color
            }

            await pet.save()
            res.status(200).json({message: 'Pet updated.'})

        } catch (error) {
            if(error instanceof Error){
                return res.status(500).json({error: error.message})
            }
            res.status(500).json({error: 'Unknown error.'})

        }

    }

    static async deletePet(req: IRequestWithUser, res: Response){

        const id = req.params.id

        const tokenUserId = (req.user as ITokenPayLoad).id

        try{

            const pet = await Pet.findById(id)
            if(!pet){
                return res.status(404).json({message: 'Pet not found.'})
            }

            if(pet.user._id.toString() !== tokenUserId){
                return res.status(401).json({message: 'Not authorized.'})
            }

            await pet.deleteOne()
            return res.status(200).json({message: 'Pet deleted.'})

        } catch (error) {
            if(error instanceof Error){
                return res.status(500).json({error: error.message})
            }
            res.status(500).json({error: 'Unknown error.'})

        }

    }

    static async schedule(req: IRequestWithUser, res: Response){

        const id = req.params.id

        const tokenUserId = (req.user as ITokenPayLoad).id

        try{

            const pet = await Pet.findById(id)

            if(!pet){
                return res.status(404).json({message: 'Pet not found.'})
            }

            if(pet.available === false){    //Check if pet has already been adopted
                return res.status(422).json({message: 'This pet id already adopted and not available for visits.'})
            }

            const user = await User.findById(tokenUserId)

            if(!user){
                return res.status(404).json({message: 'User not found.'})
            }

            if(pet.user._id.toString() === tokenUserId){
                return res.status(422).json({message: "You can't schedule a visit with your own pet."})
            }

            if(pet.adopter){
                if(pet.adopter._id.toString() === tokenUserId){
                    return res.status(422).json({message: 'You already scheduled a visit for this pet.'})
                }

                return res.status(422).json({message: 'There is already a visit scheduled for this pet.'})
            }

            pet.adopter = {
                _id: user._id,
                name: user.name,
                phone: user.phone
            }

            await pet.save()

            res.status(200).json({message: `The visit was scheduled with success, contact ${pet.user.name} by phone ${pet.user.phone}`})

        } catch (error) {
            if(error instanceof Error){
                return res.status(500).json({error: error.message})
            }
            res.status(500).json({error: 'Unknown error.'})

        }

    }
    
    static async removeSchedule(req: IRequestWithUser, res: Response){

        const id = req.params.id
        const tokenUserId = (req.user as ITokenPayLoad).id

        try{

            const pet = await Pet.findById(id)

            if(!pet){
                return res.status(404).json({message: 'Pet not found.'})
            }

            if(pet.available === false){    //Check if pet has already been adopted
                return res.status(422).json({message: 'This pet is already adopted.'})
            }

            if(!pet.adopter){
                return res.status(422).json({message: "This pet doesn't have a visit scheduled."})
            }

            if(pet.user._id.toString() === tokenUserId || pet.adopter._id.toString() === tokenUserId){
                pet.adopter = null
                await pet.save()
                return res.status(200).json({message: 'Scheduled visit removed with success.'})
            }

            return res.status(401).json({message: 'Not authorized.'})



        } catch (error) {
            if(error instanceof Error){
                return res.status(500).json({error: error.message})
            }
            res.status(500).json({error: 'Unknown error.'})

        }

    }

    static async concludeAdoption(req: IRequestWithUser, res: Response){

        const id = req.params.id
        const tokenUserId = (req.user as ITokenPayLoad).id

        try{

            const pet = await Pet.findById(id)

            if(!pet){
                return res.status(404).json({message: 'Pet not found.'})
            }

            if(pet.user._id.toString() !== tokenUserId){
                return res.status(401).json({message: 'Not authorized.'})
            }

            if(pet.available === false){    //Check if pet has already been adopted
                return res.status(422).json({message: 'This pet is already adopted.'})
            }

            if(!pet.adopter){
                return res.status(422).json({message: "This pet doesn't have a visit scheduled, so it can't be adopted yet."})
            }

            pet.available = false

            await pet.save()

            return res.status(200).json({message: 'Pet adopted with success.'})

        } catch (error) {
            if(error instanceof Error){
                return res.status(500).json({error: error.message})
            }
            res.status(500).json({error: 'Unknown error.'})

        }

    }

}