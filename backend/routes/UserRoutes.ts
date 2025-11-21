import { UserController } from '../controllers/UserController'
import { Router } from 'express'
const router = Router()
import type {Response, Request } from 'express'
import {User, type IUser} from '../models/User.js'

router.post('/register', UserController.register)