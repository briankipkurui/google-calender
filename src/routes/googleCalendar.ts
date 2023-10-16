import express, { Request, Response } from 'express'
import { googleCalendarService } from '../services/googleCalendarService';


const router = express.Router()

router.post('/create-token', async (req: Request, res: Response) => {
    try {
        return googleCalendarService.creatTokenandSignUpUser(req, res)
    } catch (error) {
        res.sendStatus(500).send(error)
    }
})
router.get('/users', async (req: Request, res: Response) => {
    try {
        return googleCalendarService.getAllUsers(req, res)
    } catch (error) {
        res.sendStatus(500).send(error)
    }
})
router.get('/generate-events', async (req: Request, res: Response) => {
    try {
        return googleCalendarService.generateEvents(req, res)
    } catch (error) {
        console.log("this error is..........", error)
        res.sendStatus(500).send(error)
    }
})

export { router as googleCalendar }