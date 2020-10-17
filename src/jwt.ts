import { Request, NextFunction } from 'express'

import jwt from 'jsonwebtoken'

import { ResPayload, Payload } from './@types/params'

import 'dotenv/config'

const { secret } = process.env
if (!secret) throw Error(`Can't read the secret from environment variables`)

const expiresIn = 365 * 24 * 3600 // 365 days

export const signToken = (mailid: string) =>
  jwt.sign({ mailid }, secret, { expiresIn })

const verify = (token: string) =>
  jwt.verify(token.replace(/^Bearer\s/, ''), secret)

export const ensureAuth = (
  req: Request,
  res: ResPayload,
  next: NextFunction
) => {
  const { authorization } = req.headers
  if (!authorization) {
    res.status(401).send()
    throw Error('No Authorization headers')
  }

  try {
    res.locals = verify(authorization) as Payload
  } catch (e) {
    res.status(401)
    throw e
  }
  next()
}
