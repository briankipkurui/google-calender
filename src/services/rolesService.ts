import { Request, Response } from "express"
import { validationResult } from "express-validator"
import { RequestValidationError } from "../errors/request-validation-error"
import { BadRequestError } from "../errors/bad-request-error"
import { rolesAtributes, validRolesKeys } from "../models/allModels"
import { PrismaClient } from "@prisma/client"
import { NotFoundGenericError } from "../errors/Not-found-generic-error"
import { utilities } from "../utils/utilities"
import { DatabaseConnectionError } from "../errors/database-connection-error"

const prisma = new PrismaClient()

export class rolesService {


    static async addRole(req: Request, res: Response): Promise<Response> {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new RequestValidationError(errors.array())
        }
        const role: rolesAtributes = req.body

        const foreignKeys = Object.keys(role).filter(key => !validRolesKeys.has(key))

        if (foreignKeys.length > 0) {
            throw new BadRequestError('Invalid properties in role object')
        }

        const toUpperCase = role.name.toUpperCase()

        const roleExist = await prisma.roles.findFirst({
            where: {
                name: toUpperCase,
            },
        })
        if (roleExist) {
            throw new NotFoundGenericError(`role ${role.name} exist`)
        }

        const generatedRandomkey = await utilities.generateRandomString(20)

        const saveUser = await prisma.roles.create({
            data: {
                name: toUpperCase,
                encodeKey: generatedRandomkey
            }
        }).catch((err) => {
            if (err) {
                throw new DatabaseConnectionError()
            }
        }).finally(async () => {
            await prisma.$disconnect()
        })
        return res.status(201).send(saveUser)
    }

    static async addRoleToUser(req: Request, res: Response): Promise<Response> {
        const userId = parseInt(req.params.userId)
        const { rolesToAdd } = req.body

        const user = await prisma.users.findUnique({
            where: { id: userId },
            include: { userRole: true }
        })

        if (!user) {
            throw new NotFoundGenericError(`user with ${userId} was not found`)
        }

        console.log("alksjdhgf", rolesToAdd)

        const addedRoles = [];

        for (const roleName of rolesToAdd) {
            const existingRole = await prisma.roles.findFirst({
                where: { name: roleName },
            });

            if (!existingRole) {
                console.error(`Role "${roleName}" does not exist `);
                continue;
            }

            const userHasRole = user.userRole.some((userRole) => userRole.roleId === existingRole.id)

            if (!userHasRole) {
                await prisma.userRole.create({
                    data: {
                        userId: userId,
                        roleId: existingRole.id
                    },
                }).catch((err) => {
                    console.log(err)
                })

                addedRoles.push(roleName);
            }
        }

        const disconnect = async () => {
            await prisma.$disconnect()
        }

        disconnect
        return res.status(201).send(addedRoles)

    }


}