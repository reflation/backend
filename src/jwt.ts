import { Request, Response, NextFunction } from 'express'

import jwt, { JsonWebTokenError } from 'jsonwebtoken'
import dotenv from 'dotenv'
import crypto from 'crypto'

import { base64EncodeReplace } from './utils/base64'

import { TypePayloadRes, TypePayload } from './@types/params'
import { RequestHandler } from 'express-serve-static-core'
import { Dictionary } from 'lodash'
import { TypeUser } from './@types/models'

dotenv.config()
const secret = process.env.secret!
const expiresIn = 365 * 24 * 3600 // 365 days

const encodedHeader = base64EncodeReplace({
  alg: 'HS256',
  typ: 'JWT',
})

const sign = ({ payload }: { payload: string | object }) =>
  crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${base64EncodeReplace(payload)}`)
    .digest('base64')
    .replace('=', '')

export const signToken = (name: string) =>
  jwt.sign({ name }, secret, { expiresIn })

const verify = (token: string) =>
  jwt.verify(token.replace(/^Bearer\s/, ''), secret)

export const ensureAuth = (
  req: Request,
  res: TypePayloadRes,
  next: NextFunction
) => {
  const { authorization } = req.headers
  if (!authorization) {
    res.status(401).send()
    throw Error('No Authorization headers')
  }

  try {
    res.locals = verify(authorization) as TypePayload
  } catch (e) {
    res.status(401)
    throw e
  }
  next()
}
