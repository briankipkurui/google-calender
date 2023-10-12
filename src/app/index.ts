import express from 'express';
import { json } from 'body-parser';
import 'express-async-errors'
import dotenv from "dotenv"

import { users } from '../routes/users';
import { errorHandler } from '../middlewares/error-handler';
import { NotFoundError } from '../errors/not-found-error';

dotenv.config()

const port = process.env.PORT

const app = express()
app.use(json())
app.use('/api/v1', users)

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})

