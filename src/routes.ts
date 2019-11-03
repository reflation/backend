import dotenv from 'dotenv'

import { Request, Response } from 'express'

import { sendMail } from './mail'
import { login, LoginResult } from './checkVaild'
import { searchUser, appnedUserData } from './models'
import { domain } from './varables'

import { fetchAndParse } from './utils/fetch'
import { TypeReq, TypeReqAuth, TypePayloadRes } from './@types/params'

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

  await sendMail({
    to: `${mailid}@${domain}`,
    text: `localhost:3000/main&token=${result.token}`,
  })

  res.status(201).end()
}

export const fetchRoute = async (
  { body }: TypeReqAuth,
  res: TypePayloadRes
) => {
  try {
    const data = await fetchAndParse(body)
    await appnedUserData({ ...data, mailid: res.locals.mailid })
    res.status(201).send({ ...data })
  } catch (e) {
    console.error(e)
    res.status(401).end()
  }
}

export const cacheRoute = async (req: Request, res: TypePayloadRes) => {
  const data = await searchUser(res.locals.mailid)
  data ? res.status(200).send({ ...data }) : res.status(204).end()
}
