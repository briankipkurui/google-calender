import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { BadRequestError } from "../errors/bad-request-error"
import { utilities } from "../utils/utilities"
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export class authicationService {

    static async signIn(req: Request, res: Response): Promise<Response> {
        const { email, password } = req.body
        if (!email || !password) {
            throw new BadRequestError('username and password is required')
        }
        const existingUser = await prisma.users.findFirst({
            where: {
                email: email,
            },
            include: { userRole: true }
        })
        if (!existingUser) {
            throw new BadRequestError('Invalid username')
        }
        const passwordsMatch = await utilities.compare(
            existingUser.password,
            password
        )
        if (!passwordsMatch) {
            throw new BadRequestError('Invalid password');
        }
        const userRoles: any = []
        const roles = existingUser.userRole
        for (const role of roles) {
            const roleId = role.roleId
            const getRole = await prisma.roles.findFirst({
                where: {
                    id: roleId,
                },
                include: { userRole: true },
            })

            if (getRole) {
                userRoles.push(getRole.name)
            }
        }

        const secret: any = process.env.ACCESS_TOKEN_SECRET_KEY

        const accessToken: any = jwt.sign(
            {
                UserInfo: {
                    username: existingUser.id,
                    roles: userRoles,
                    userDetails: existingUser
                }
            },
            secret,
            { expiresIn: '120s' }
        );

        const secretKey: any = process.env.REFRESH_TOKEN_SECRETE_KEY

        const refreshToken = jwt.sign(
            { "username": existingUser.email },
            secretKey,
            { expiresIn: '1d' }
        );
        await prisma.users.update({
            where: { id: existingUser.id },
            data: {
                refreshToken,
            },
        }).catch((err) => {
            if (err) {
                throw new BadRequestError('error occured')
            }
        }).finally(async () => {
            await prisma.$disconnect()
        })
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 24 * 60 * 60 * 1000 });
        return res.json({ accessToken })
    }
}