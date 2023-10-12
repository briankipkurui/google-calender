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

export { router as googleCalendar }