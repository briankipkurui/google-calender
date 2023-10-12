import { Request, Response } from 'express'
const { google } = require('googleapis')
import dotenv from "dotenv"

dotenv.config()
const hed1 = process.env.GOOGLE__CLIENT_ID
const hed2 = process.env.GOOGLE_CLIENT_SECRET
const hed3 = process.env.ORIGIN

const oauth2Client = new google.auth.OAuth2(
    hed1,
    hed2,
    hed3
)
export class googleCalendarService {
    
    static async creatTokenandSignUpUser(req: Request, res: Response): Promise<Response> {
        const { code } = req.body
        const response = await oauth2Client.getToken(code)

        return res.send(response)

    }
}