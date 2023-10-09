import { Request, Response } from 'express'
import { userAtribute, validUserKeys } from '../models/allModels'
import { BadRequestError } from '../errors/bad-request-error';
import { validationResult } from 'express-validator'
import { RequestValidationError } from '../errors/request-validation-error';

import { PrismaClient } from '@prisma/client';
import { DatabaseConnectionError } from '../errors/database-connection-error';
import { utilities } from '../utils/utilities';
import { NotFoundGenericError } from '../errors/Not-found-generic-error';

const prisma = new PrismaClient()


export class userService {


    static async signup(req: Request, res: Response): Promise<Response> {

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            throw new RequestValidationError(errors.array())
        }
        const user: userAtribute = req.body

        const foreignKeys = Object.keys(user).filter(key => !validUserKeys.has(key))

        if (foreignKeys.length > 0) {
            throw new BadRequestError('Invalid properties in user object')
        }

        const existingUser = await prisma.users.findFirst({
            where: {
                email: user.email,
            },
        })
        if (existingUser) {
            throw new BadRequestError('user exist')
        }

        const password = await utilities.toHash(user.password)

        const saveUser = await prisma.users.create({
            data: {
                firstName: user.firstName,
                lastName: user.lastName,
                password: password,
                email: user.email,
                phoneNumber: user.phoneNumber
            }
        }).catch((err) => {
            if (err) {
                throw new DatabaseConnectionError()
            }
        }).finally(async () => {
            await prisma.$disconnect()
        })

        const userResponse = { ...saveUser, password: undefined }
        return res.status(201).send(userResponse)

    }

    static async editUser(req: Request, res: Response): Promise<Response<string>> {
        const userId = parseInt(req.params.userId)
        const user: userAtribute = req.body

        if (isNaN(userId)) {
            throw new BadRequestError('pathVarible passed is not a number')
        }
        const foreignKeys = Object.keys(user).filter(key => !validUserKeys.has(key))

        if (foreignKeys.length > 0) {
            throw new BadRequestError('Invalid properties in user object')
        }

        const returnedUser = await prisma.users.findFirst({
            where: {
                id: userId,
            },
        }).catch((err) => {
            if (err) {
                throw new DatabaseConnectionError()
            }
        }).finally(async () => {
            await prisma.$disconnect()
        })

        if (!returnedUser) {
            throw new NotFoundGenericError(`user with id ${userId}  was not found`)
        }
        const updatedUser = await prisma.users.update({
            where: { id: userId },
            data: user,
        }).catch((err) => {
            if (err) {
                throw new DatabaseConnectionError()
            }
        }).finally(async () => {
            await prisma.$disconnect()
        })

        const aa = `user with  ${userId} was successfully updated`
        return res.status(200).send(aa)
    }

    static async deleteUser(req: Request, res: Response): Promise<Response> {
        const userId = parseInt(req.params.userId)
        if (isNaN(userId)) {
            throw new BadRequestError('pathVarible passed is not a number')
        }

        const returnedUser = await prisma.users.findFirst({
            where: {
                id: userId,
            },
        }).catch((err) => {
            if (err) {
                throw new DatabaseConnectionError()
            }
        }).finally(async () => {
            await prisma.$disconnect()
        })

        if (!returnedUser) {
            throw new NotFoundGenericError(`user with id ${userId}  was not found`)
        }
        const deletedUser = await prisma.users.delete({
            where: { id: userId },
        }).catch((err) => {
            if (err) {
                throw new DatabaseConnectionError()
            }
        }).finally(async () => {
            await prisma.$disconnect()
        })

        return res.status(204).send({})
    }




}