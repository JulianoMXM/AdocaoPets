import { constants } from 'buffer'
import { User } from '../models/User.js'
import { Request, Response} from 'express'
import bcrypt  from 'bcrypt'
import { createUserToken } from '../helpers/create-user-token.js'

export class UserController {

    static async register(req: Request, res: Response){
        
        const {name, email, password, confirmpassword, phone} = req.body

        if(!name){
            res.status(422).json({message: 'O nome é obrigatório.'})
            return
        }
        if(!email){
            res.status(422).json({message: 'O email é obrigatório.'})
            return
        }
        if(!password){
            res.status(422).json({message: 'A senha é obrigatória.'})
            return
        }
        if(!confirmpassword){
            res.status(422).json({message: 'A confirmação de senha é obrigatória.'})
            return
        }
        if(!phone){
            res.status(422).json({message: 'O telefone é obrigatório.'})
            return
        }

        if(password !== confirmpassword){
            res.status(422).json({message: 'As senhas digitadas são diferentes.'})
            return
        }

        //Teste de usuário existente

        const userExists = await User.findOne({email: email})

        if(userExists){
            res.status(422).json({message: 'Já existe um usuário com esse email.'})
            return
        }

        //Criação de senha
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        //Criação de Usuário

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
            res.status(422).json({message: 'O email é obrigatório.'})
            return
        }
        if(!password){
            res.status(422).json({message: 'A senha é obrigatória.'})
            return
        }

        const user = await User.findOne({email: email})

        //Checa se o email existe

        if(!user){
            res.status(422).json({message: 'Email inválido.'})
            return
        }

        const checkPassword = await bcrypt.compare(password, user.password)

        if(!checkPassword){
            res.status(422).json({message: 'Senha inválida.'})
            return
        }

        await createUserToken(user, req, res)

    }

}