import { Request, Response } from "express"
import { BadRequestError } from "../errors/bad-request-error"
import { PrismaClient } from "@prisma/client"
import { DatabaseConnectionError } from "../errors/database-connection-error"
import { productAtributes } from "../models/allModels"

const prisma = new PrismaClient()
export class productService {
    static async editProduct(req: Request, res: Response): Promise<Response> {
        const editAtr: productAtributes = req.body

        if (!editAtr.name || !editAtr.price) {
            throw new BadRequestError('field should not be blank')
        }
        return res.status(200).send("i was edited before")
    }

    static async addProducts(req: Request, res: Response): Promise<Response> {

        const { name, price } = req.body

        if (!price || !name) {
            throw new BadRequestError('field should not be blank')
        }

        const saveProducts = await prisma.products.create({
            data: {
                name: name,
                price: price
            }
        }).catch((err) => {
            if (err) {
                console.log(err)
                throw new DatabaseConnectionError()
            }
        }).finally(async () => {
            await prisma.$disconnect()
        })

        return res.status(200).send(saveProducts)
    }
}