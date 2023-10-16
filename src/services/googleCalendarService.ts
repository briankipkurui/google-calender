import { Request, Response } from 'express'
const { google } = require('googleapis')
import dotenv from "dotenv"
import jwt_decode from "jwt-decode";
import { PrismaClient } from '@prisma/client';
import { DatabaseConnectionError } from '../errors/database-connection-error';
import { BadRequestError } from '../errors/bad-request-error';
import { utilities } from '../utils/utilities';
var XLSX = require("xlsx")
const fs = require('fs');
const nodemailer = require('nodemailer');

dotenv.config()
const hed1 = process.env.GOOGLE__CLIENT_ID
const hed2 = process.env.GOOGLE_CLIENT_SECRET
const hed3 = process.env.ORIGIN

const oauth2Client = new google.auth.OAuth2(
    hed1,
    hed2,
    hed3
)
const prisma = new PrismaClient()
export class googleCalendarService {

    static async creatTokenandSignUpUser(req: Request, res: Response): Promise<Response> {
        const { code } = req.body
        const response = await oauth2Client.getToken(code)
        var decoded: any = jwt_decode(response.tokens.id_token)

        const existingUser = await prisma.users.findFirst({
            where: {
                email: decoded.email,
            },
        })
        if (existingUser) {

            const updatedUser = await prisma.users.update({
                where: { id: existingUser.id },
                data: {
                    email: decoded.email,
                    name: decoded.name,
                    refreshToken: response.tokens.refresh_token,
                    accessToken: response.tokens.access_token,
                }
            }).catch((err) => {
                if (err) {
                    throw new DatabaseConnectionError()
                }
            }).finally(async () => {
                await prisma.$disconnect()
            })
            return res.send(response)
        }
        const saveUser = await prisma.users.create({
            data: {
                email: decoded.email,
                name: decoded.name,
                refreshToken: response.tokens.refresh_token,
                accessToken: response.tokens.access_token,
            }
        }).catch((err) => {
            if (err) {
                throw new DatabaseConnectionError()
            }
        }).finally(async () => {
            await prisma.$disconnect()
        })
        console.log("decoded data.......", decoded)
        console.log("response data data", response)
        return res.send(response)
    }

    static async getAllUsers(req: Request, res: Response): Promise<Response> {
        const users = await prisma.users.findMany();
        return res.send(users);
    }

    static async generateEvents(req: Request, res: Response): Promise<Response> {

        const startDate = req.query.startDate
        const endDate = req.query.endDate
        const refresh_token = req.query.refreshToken
        console.log(`startDate,........${startDate} and endDate is ${endDate} and refresh token is..${refresh_token}`)
        oauth2Client.setCredentials({ refresh_token: refresh_token })
        const calender = google.calendar({ version: 'v3', auth: oauth2Client })

        const events = await calender.events.list({
            calendarId: 'primary',
            timeMax: endDate,
            timeMin: startDate,
            // maxResults: 1000,
            singleEvents: true,
            paginationDetails: 'ON',
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
            'eventType'
        ]

        const transformedData = events.data.items.map((item: any) => {
            const transformedItem: any = {};
            for (const header of headers) {
                const keys = header.split('.');
                let value = item;
                for (const key of keys) {
                    value = value[key];
                }
                transformedItem[header] = value;
            }
            return transformedItem;
        })


        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(transformedData)
        XLSX.utils.book_append_sheet(workbook, worksheet, "events");
        const fileNamex = 'events.xlsx'
        if (!fs.existsSync(fileNamex)) {
            XLSX.writeFile(workbook, fileNamex);
            console.log(`Excel file "${fileNamex}" created.`);
        } else {
            XLSX.writeFile(workbook, fileNamex)
        }

        
        const transporter = nodemailer.createTransport({
            service: 'Gmail', 
            auth: {
              user: 'maiyojohnkip@gmail.com',
              pass: 'icxbroggmmmmbnoe',
            },
          });
          const mailOptions = {
            from: 'maiyojohnkip@gmail.com',
            to: 'kipkuruibrian98@gmail.com', 
            subject: 'Excel Sheet Attachment',
            text: 'Attached is the Excel sheet.',
            attachments: [
              {
                filename: fileNamex,
                path: fileNamex,
              },
            ],
          };
          
          
          transporter.sendMail(mailOptions, (error:any, info:any) => {
            if (error) {
              console.error('Error sending email: ' + error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          })

        return res.send(events.data.items)


    }
}