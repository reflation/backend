import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import crypto from 'crypto'

import { TypeEnv } from './@types/env'

dotenv.config()
const secret = process.env.secret!

const base64Encode = (data: string | object) => {
  let Bf: Buffer
  if (typeof data === 'string') Bf = Buffer.from(data)
  else Bf = Buffer.from(JSON.stringify(data))
  return Bf.toString('base64').replace('=', '')
}
const encodedHeader = base64Encode({
  alg: 'HS256',
  typ: 'JWT',
})

const sign = ({ payload }: { payload: string | object }) =>
  crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${base64Encode(payload)}`)
    .digest('base64')
    .replace('=', '')

export const create = (username: string) =>
  // @ts-ignore: 'rej' has 'any' type
  new Promise<string>((res, rej) => {
    jwt.sign(
      { username },
      sign({ payload: username }),
      {
        expiresIn: '1h',
      },
      (err, token) => (err ? rej(err) : res(token))
    )
  })
