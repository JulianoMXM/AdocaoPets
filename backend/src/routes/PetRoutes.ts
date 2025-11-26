import { Router } from 'express'
import { PetController } from '../controllers/PetController.js'
import { checkToken } from '../helpers/verify-token.js'
export const router = Router()

router.post('/create', checkToken, PetController.create)
router.get('/', PetController.getAll)
router.get('/mypets', checkToken, PetController.getAllUserPets)
router.get('/:id', PetController.findPetById)
router.patch('/:id', checkToken, PetController.editPet)
router.delete('/:id', checkToken, PetController.deletePet)