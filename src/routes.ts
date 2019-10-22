import dotenv from 'dotenv'

import { Request, Response } from 'express'

import { sendMail } from './mail'
import { signToken } from './jwt'
import { isNotVaild } from './checkVaild'
import {
  createUser,
  searchUser,
  isUserNotExist,
  appnedUserData,
} from './models'

import { fetch } from './utils/fetch'
import { TypeReq, TypeReqAuth, TypePayloadRes } from './@types/params'

const mode = process.env.mode!

export const loginRoute = async ({ body }: TypeReq<string>, res: Response) => {
  const to = `${body}@jejunu.ac.kr`

  if (await isNotVaild(to)) return res.status(401).end()

  if (isUserNotExist(body)) createUser({ name: body })

  const token = signToken(body)

  if (mode === 'dev') {
    res.status(201).send(token)
    return
  }

  await sendMail({ to, text: `localhost:3000/main&token=${token}` })
  res.status(201).end()
}

export const fetchRoute = async (
  { body }: TypeReqAuth,
  res: TypePayloadRes
) => {
  const data = await fetch(body)
  appnedUserData({ name: res.locals.name, data: parseFloat(data) })
  res.status(201).send(data)
}

export const GPARoute = (req: Request, res: TypePayloadRes) => {
  const { data } = searchUser(res.locals.name)
  data ? res.status(200).send(data.toString()) : res.status(204).end()
}
