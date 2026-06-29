import express from 'express'
import {
    getCars,
    getCar,
    createCar,
    updateCar,
    deleteCar,
    getOptions
} from '../controllers/cars.js'

const router = express.Router()

// options (features the user can pick from)
router.get('/options', getOptions)
router.get('/options/:feature', getOptions)

// saved custom cars
router.get('/cars', getCars)
router.get('/cars/:id', getCar)
router.post('/cars', createCar)
router.put('/cars/:id', updateCar)
router.delete('/cars/:id', deleteCar)

export default router
