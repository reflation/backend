import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'

import { loginRoute, fetchRoute, GPARoute } from './routes'
import { ensureAuth } from './jwt'

const app = express()

// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

app.post('/login', bodyParser.json(), loginRoute)

app.post(
  '/fetch',
  bodyParser.urlencoded({ extended: false }),
  ensureAuth,
  fetchRoute
)

app.get('/GPA', ensureAuth, GPARoute)

export default app
