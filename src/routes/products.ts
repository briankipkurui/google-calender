import express, { Request, Response } from "express"
import { productService } from "../services/productService"
const router = express()

router.post('/products', async (req: Request, res: Response): Promise<Response> => {
    return productService.addProducts(req, res)
})
router.put('/products/:productId', async (req: Request, res: Response): Promise<Response> => {
  return productService.editProduct(req,res)
})

export { router as products }