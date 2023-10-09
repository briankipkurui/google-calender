import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { userService } from '../services/userService'

const router = express.Router()

router.post('/users/signup',
    [
        body('email')
            .not()
            .isEmpty()
            .withMessage('email cannot be empty')
            .isEmail()
            .withMessage('email must be valid'),
        body('password')
            .not()
            .isEmpty()
            .withMessage('password cannot be empty')
            .trim()
            .isLength({ min: 4, max: 20 })
            .withMessage('Password must be between 4 and 20 characters'),
        body('firstName')
            .not()
            .isEmpty()
            .withMessage('First Name cannot be empty'),
        body('lastName')
            .not()
            .isEmpty()
            .withMessage('last Name cannot be empty'),
        body('phoneNumber')
            .not()
            .isEmpty()
            .withMessage('phoneNumber cannot be empty')
    ], async (req: Request, res: Response): Promise<Response> => {
        return userService.signup(req, res)
    })

router.put('/users/edit/:userId', async (req: Request, res: Response): Promise<Response<string>> => {
    return userService.editUser(req, res)
})

router.delete('/users/delete/:userId', async (req: Request, res: Response): Promise<Response> => {
    return userService.deleteUser(req, res)
})

export { router as users }