import { Router } from 'express'
import { PetController } from '../controllers/PetController.js'
import { checkToken } from '../helpers/verify-token.js'
export const router = Router()

router.post('/create', checkToken, PetController.create)