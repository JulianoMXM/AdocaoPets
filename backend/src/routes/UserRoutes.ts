import { UserController } from '../controllers/UserController.js'
import { Router } from 'express'
export const router = Router()

//Token
import { checkToken } from '../helpers/verify-token.js'

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/checkUser', UserController.checkUser)
router.get('/:id', UserController.findUserById)
router.patch('/:id', checkToken, UserController.editUser)
router.delete('/:id', checkToken, UserController.deleteUser)