import express from 'express';
import { json } from 'body-parser';
import 'express-async-errors'
import dotenv from "dotenv"

import { googleCalendar } from '../routes/googleCalendar';
import { errorHandler } from '../middlewares/error-handler';
import { NotFoundError } from '../errors/not-found-error';

dotenv.config()
const port = process.env.PORT

const app = express()
app.use(json())
app.use('/api/v1', googleCalendar)

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})

