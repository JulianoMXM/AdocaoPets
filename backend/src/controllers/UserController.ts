import { User } from '../models/User.js'
import { Request, Response} from 'express'
import bcrypt  from 'bcrypt'
import jwt from 'jsonwebtoken'

//Token
import { createUserToken } from '../helpers/create-user-token.js'
import { getToken } from '../helpers/get-token.js'
import { ITokenPayLoad } from '../types/TokenPayLoad.js'
import { getUserByToken } from '../helpers/get-user-by-token.js'

export class UserController {

    static async register(req: Request, res: Response){
        
        const {name, email, password, confirmpassword, phone} = req.body

        if(!name){
            res.status(422).json({message: 'Name is required.'})
            return
        }
        if(!email){
            res.status(422).json({message: 'Email is required.'})
            return
        }
        if(!password){
            res.status(422).json({message: 'Password is required.'})
            return
        }
        if(!confirmpassword){
            res.status(422).json({message: 'Confirmation password is required.'})
            return
        }
        if(!phone){
            res.status(422).json({message: 'Phone is required.'})
            return
        }

        if(password !== confirmpassword){
            res.status(422).json({message: "Passwords don't match."})
            return
        }

        //Test if user already exists

        const userExists = await User.findOne({email: email})

        if(userExists){
            res.status(422).json({message: 'Email already in usage.'})
            return
        }

        //Password creation
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
                res.status(500).json({message: error.message})
            }
        }

    }

    static async login(req: Request, res: Response){

        const {email, password} = req.body

        if(!email){
            res.status(422).json({message: 'Email is required.'})
            return
        }
        if(!password){
            res.status(422).json({message: 'Password is required.'})
            return
        }

        const user = await User.findOne({email: email})

        //Check if there's an user with this email
        if(!user){
            res.status(422).json({message: 'Invalid email.'})
            return
        }

        const checkPassword = await bcrypt.compare(password, user.password)

        if(!checkPassword){
            res.status(422).json({message: 'Invalid password.'})
            return
        }

        await createUserToken(user, req, res)

    }

    static async checkUser(req: Request, res: Response){

        let currentUser
        const JWT_TOKEN = process.env.JWT_TOKEN || ""

        if(req.headers.authorization){

            const token = getToken(req)
            console.log(token)

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

                res.status(404).json({message: 'User not found.'})
                return
            }

            res.status(200).json(user)

        }catch(error){

            if(error instanceof Error){
                return res.status(500).json({error: error.message})
            }
            res.status(500).json({error: 'Unknown error.'})
        }

    }

    static async editUser(req: Request, res: Response){

        const id = req.params.id

        //Check token
        const token = getToken(req)

        if(!token){
            res.status(401).json({message: 'Login to continue.'})
            return
        }

        const user = await getUserByToken(token)

        const {name, email, phone, password, confirmpassword} = req.body

        if(!user){

            res.status(404).json({message: 'User not found.'})
            return

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
                const userExists = await User.findOne({email: email})

                //If there's already an user with this email and it's not the own person
                if(userExists && (userExists.id !== id)){
                    res.status(422).json({message: 'Please use another email.'})
                    return
                }
                user.email = email
            }
        }

        if(password){
            if(password !== confirmpassword){

                res.status(422).json({message: "Passwords don't match."})
                return

            }

            if(password === confirmpassword && password != null){

                //Password creation
                const salt = await bcrypt.genSalt(12)
                const passwordHash = await bcrypt.hash(password, salt)

                user.password = passwordHash
            }
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

}