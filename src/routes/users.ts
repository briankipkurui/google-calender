import express, { Request, Response } from 'express'
import { body } from 'express-validator'
const { google } = require('googleapis')
var XLSX = require("xlsx")
const fs = require('fs');
import dotenv from "dotenv"

const router = express.Router()
dotenv.config()
const hed1 =  process.env.GOOGLE__CLIENT_ID
const hed2 =  process.env.GOOGLE_CLIENT_SECRET
const hed3 =   process.env.ORIGIN

const oauth2Client = new google.auth.OAuth2(
    hed1,
    hed2,
    hed3
)

const REFRESH_TOKEN = process.env.REFRESH_TOKEN



router.post('/create-token', async (req: Request, res: Response) => {
    try {

        const { code } = req.body
        const response = await oauth2Client.getToken(code)

        res.send(response)
    } catch (error) {
        res.sendStatus(500).send(error)
    }
})

router.post('/get-events', async (req: Request, res: Response) => {
    try {
        oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })
        const calender = google.calendar({ version: 'v3', auth: oauth2Client })

        const events = await calender.events.list({
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        })


        const headers: any = [
            'created',
            'start.dateTime',
            'start.timeZone',
            'end.dateTime',
            'end.timeZone',
            'location',
            'summary',
            'description',
            'creator.email',
            'creator.self',
            'organizer.email',
            'organizer.self',
            'etag',
            'id',
            'status',
            'htmlLink',
            'kind',
            'updated',
            'sequence',
            'reminders',
            'eventType',

        ]

        const transformedData = events.data.items.map((item: any) => {
            const transformedItem: any = {};
            for (const header of headers!) {
                const keys = header.split('.');
                let value = item
                for (const key of keys) {
                    value = value[key];
                }
                transformedItem[header] = value;
            }
            return transformedItem;
        })

        const workbook = XLSX.utils.book_new()
        const worksheet = XLSX.utils.json_to_sheet(transformedData)
        XLSX.utils.book_append_sheet(workbook, worksheet, "events");
        const fileNamex = 'events.xlsx'
        if (!fs.existsSync(fileNamex)) {
            XLSX.writeFile(workbook, fileNamex);
            console.log(`Excel file "${fileNamex}" created.`);
        } else {
            XLSX.writeFile(workbook, fileNamex)
        }
        res.send(events.data.items)
    } catch (error) {
        console.log("this error is..........", error)
        res.sendStatus(500)
    }
})

export { router as users }