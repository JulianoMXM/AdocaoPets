import { User } from '../models/User.js'
import { Request, Response} from 'express'
import bcrypt  from 'bcrypt'
import jwt from 'jsonwebtoken'

//Token
import { createUserToken } from '../helpers/create-user-token.js'
import { getToken } from '../helpers/get-token.js'
import { ITokenPayLoad } from '../types/TokenPayLoad.js'
import { IRequestWithUser } from '../types/RequestWithUser.js'

export class UserController {

    static async register(req: Request, res: Response){
        
        const {name, email, password, confirmpassword, phone} = req.body

        if(!name){
            return res.status(422).json({message: 'Name is required.'})
        }
        if(!email){
            return res.status(422).json({message: 'Email is required.'})
        }
        if(!password){
            return res.status(422).json({message: 'Password is required.'})
        }
        if(!confirmpassword){
            return res.status(422).json({message: 'Confirmation password is required.'})
        }
        if(!phone){
            return res.status(422).json({message: 'Phone is required.'})
        }

        if(password !== confirmpassword){
            return res.status(422).json({message: "Passwords don't match."})
        }

        //Test if user already exists

        const userExists = await User.findOne({email: email})

        if(userExists){
            return res.status(422).json({message: 'Email already in usage.'})
        }

        //Password hash creation
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        //User creation

        const user = new User({
            name,
            email,
            phone,
            password: passwordHash
        })

        try {

            const newUser = await user.save()
            
            await createUserToken(newUser, req, res)

        } catch(error) {
            if(error instanceof Error){
                return res.status(500).json({message: error.message})
            }
            res.status(500).json({error: 'Unknown error.'})
        }

    }

    static async login(req: Request, res: Response){

        const {email, password} = req.body

        if(!email){
            return res.status(422).json({message: 'Email is required.'})
        }
        if(!password){
            return res.status(422).json({message: 'Password is required.'})
        }

        const user = await User.findOne({email: email})

        //Check if there's an user with this email
        if(!user){
            return res.status(422).json({message: 'Invalid email.'})
        }

        const checkPassword = await bcrypt.compare(password, user.password)

        if(!checkPassword){
            return res.status(422).json({message: 'Invalid password.'})
        }

        await createUserToken(user, req, res)

    }

    static async checkUser(req: Request, res: Response){

        let currentUser
        const JWT_TOKEN = process.env.JWT_TOKEN || ""

        if(req.headers.authorization){

            const token = getToken(req)

            if(!token){
                currentUser = null
            } else {
                try {
                    const decoded = jwt.verify(token, JWT_TOKEN) as ITokenPayLoad
                    currentUser = await User.findById(decoded.id).select('-password')
                } catch (error) {
                    currentUser = null;
                }
            }

        } else {
            currentUser = null
        }

        res.status(200).json(currentUser)

    }

    static async findUserById(req: Request, res: Response){

        const id = req.params.id

        try{
            const user = await User.findById(id).select('-password')

            if(!user){
                return res.status(404).json({message: 'User not found.'})
            }

            res.status(200).json(user)

        }catch(error){

            if(error instanceof Error){
                return res.status(500).json({error: error.message})
            }
            res.status(500).json({error: 'Unknown error.'})
        }

    }

    static async editUser(req: IRequestWithUser, res: Response){

        const id = req.params.id

        const tokenUserId = (req.user as ITokenPayLoad).id

        const user = await User.findById(tokenUserId)

        const {name, email, phone, password, confirmpassword} = req.body

        if(!user){
            return res.status(404).json({message: 'User not found.'})
        }

        //If typed id is not the user id
        if(user._id.toString() !== id){
            return res.status(401).json({message: 'Not authorized.'})
        }

        if(name){
            user.name = name
        }

        if(phone){
            user.phone = phone
        }
        
        //If a new email was sent
        if(email){
            //If new email equals the email in usage
            if(user.email !== email){
                const userExists    = await User.findOne({email: email})

                //If there's already an user with this email and it's not the own person
                if(userExists && (userExists.id !== user.id)){
                    return res.status(422).json({message: 'Please use another email.'})
                }
                user.email = email
            }
        }

        if(password){
            if(password !== confirmpassword){

                return res.status(422).json({message: "Passwords don't match."})

            }
                //Password hash creation
                const salt = await bcrypt.genSalt(12)
                const passwordHash = await bcrypt.hash(password, salt)

                user.password = passwordHash
        }

        try{
            await user.save()
            res.status(200).json({message: 'User updated.'})

        } catch (error){
            if(error instanceof Error){
                return res.status(500).json({error: error.message})
            }
            res.status(500).json({error: 'Unknown error.'})
        }


    }

    static async deleteUser(req: IRequestWithUser, res: Response){

        const id = req.params.id

        const tokenUserId = (req.user as ITokenPayLoad).id

        const user = await User.findById(tokenUserId)

        if(!user){
            return res.status(404).json({message: 'User not found.'})
        }

        if(user._id.toString() !== id){
            return res.status(401).json({message: 'Not authorized.'})
        }

        try{
            await user.deleteOne()
            res.status(200).json({message: 'User deleted.'})

        } catch (error){
            if(error instanceof Error){
                return res.status(500).json({error: error.message})
            }
            res.status(500).json({error: 'Unknown error.'})
        }

    }

}