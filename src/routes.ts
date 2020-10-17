import { Request, Response } from 'express'

import { sendMail } from './mail'
import { login } from './checkVaild'
import { searchUser, appnedUserData } from './models'
import { domain } from './varables'

import { fetchAndParse } from './fetch'
import { isFetch401 } from './fetch/consts'
import { Req, ReqAuth, ResPayload } from './@types/params'

import 'dotenv/config'
const { mode } = process.env

export const loginRoute = async (
  { body: { mailid } }: Req<{ mailid: string }>,
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

type FetchError = { type: string; message: string }

export const fetchRoute = async ({ body }: ReqAuth, res: ResPayload) => {
  try {
    const data = await fetchAndParse(body)
    await appnedUserData({ ...data, mailid: res.locals.mailid })
    res.status(201).end()
  } catch (e) {
    const { type, message }: FetchError = e
    isFetch401(type)
      ? res.status(401).send({ type, message })
      : res.status(500).end()
  }
}

export const cacheRoute = async (req: Request, res: ResPayload) => {
  try {
    const data = await searchUser(res.locals.mailid)
    data.name ? res.status(200).send(data) : res.status(204).end()
  } catch (e) {
    e.message === 'No users found.'
      ? res.status(401).end()
      : res.status(500).end()
  }
}
