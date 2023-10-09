import express, { Request, Response } from "express";
import { body } from 'express-validator'
import { rolesService } from "../services/rolesService";
import { verifyJWT } from "../middlewares/verify-jwt";
import { verifyRoles } from "../middlewares/verifyRoles";
import { ROLES_LIST } from "../enum/roleList";

const router = express()

router.post('/roles',
    [
        body('name')
            .not()
            .isEmpty()
            .withMessage('this field cannot be empty')
    ],verifyJWT,verifyRoles(ROLES_LIST.ADMIN,ROLES_LIST.CLIENT),async (req: Request, res: Response): Promise<Response> => {
        return rolesService.addRole(req, res)
    })


router.post('/addRoleToUser/:userId', async (req: Request, res: Response): Promise<Response> => {
   return rolesService.addRoleToUser(req,res)
})

export { router as roles }
