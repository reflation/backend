import dotenv from 'dotenv'

import { Request, Response } from 'express'

import { sendMail } from './mail'
import { login, LoginResult } from './checkVaild'
import { searchUser, appnedUserData } from './models'
import { domain } from './varables'

import {
  fetchAndParse,
  SESSION_EXPIRED,
  INCORRECT_ACCOUNT,
} from './utils/fetch'
import { TypeReq, TypeReqAuth, TypePayloadRes } from './@types/params'

dotenv.config()

const mode = process.env.mode!

export const loginRoute = async (
  { body: { mailid } }: TypeReq<{ mailid: string }>,
  res: Response
) => {
  const result = await login(mailid)

  if ('error' in result) {
    res.status(result.error).end()
    return
  }

  if (mode === 'dev') {
    res.status(201).send(result.token)
    return
  }

  const route = result.isNull ? 'fetch' : 'main'

  await sendMail({
    to: `${mailid}@${domain}`,
    text: `localhost:3000/${route}?token=${result.token}`,
  })

  res.status(201).end()
}

export const fetchRoute = async (
  { body }: TypeReqAuth,
  res: TypePayloadRes
) => {
  try {
    const data = await fetchAndParse(body)
    const result = { ...data, mailid: res.locals.mailid }
    await appnedUserData(result)
    res.status(201).send(result)
  } catch (e) {
    if (e.message === SESSION_EXPIRED || e.message === INCORRECT_ACCOUNT) {
      res.status(401).send(e.message)
      return
    }
    res.status(500).end()
  }
}

export const cacheRoute = async (req: Request, res: TypePayloadRes) => {
  try {
    const data = await searchUser(res.locals.mailid)
    data.name ? res.status(200).send(data) : res.status(204).end()
  } catch (e) {
    e.message === 'No users found.'
      ? res.status(401).end()
      : res.status(500).end()
  }
}
