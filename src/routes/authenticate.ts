import express, { Request, Response } from "express"
import { authicationService } from "../services/authenticateService"

const router = express()

router.post('/signin', async (req: Request, res: Response):Promise<Response> => {
  return authicationService.signIn(req,res)
})


export { router as authenticate }