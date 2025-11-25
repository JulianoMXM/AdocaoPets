import { UserController } from '../controllers/UserController.js'
import { Router } from 'express'
export const router = Router()
import type {Response, Request } from 'express'
import {User, type IUser} from '../models/User.js'

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/checkUser', UserController.checkUser)
router.get('/:id', UserController.findUserById)
router.patch('/edit', UserController.editUser)