import { Router } from 'express'
const router = Router()
import type {Response, Request } from 'express'
import {Pet, type IPet} from '../models/Pet.js'

router.post('/')