import express from 'express';
import { json } from 'body-parser';
import 'express-async-errors'

import { users } from '../routes/users';
import { roles } from '../routes/roles';
import { authenticate } from '../routes/authenticate';
import { products } from '../routes/products';
import { errorHandler } from '../middlewares/error-handler';
import { NotFoundError } from '../errors/not-found-error';

const port = process.env.PORT 

const app = express()
app.use(json())
app.use('/api/v1', users)
app.use('/api/v1', roles)
app.use('/api/v1', authenticate)
app.use('/api/v1', products)

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})

