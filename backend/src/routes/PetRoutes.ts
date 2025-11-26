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
router.patch('/schedule/:id', checkToken, PetController.schedule)
router.patch('/removeSchedule/:id', checkToken, PetController.removeSchedule)
router.patch('/conclude/:id', checkToken, PetController.concludeAdoption)