import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'

import { LoginRoute } from './routes'

const app = express()

// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

app.post('/login', bodyParser.text({ type: 'text/plain' }), LoginRoute)

app.listen(3000, () => console.log('server start'))
