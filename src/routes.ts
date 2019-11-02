import dotenv from 'dotenv'

import { Request, Response } from 'express'

import { sendMail } from './mail'
import { login } from './checkVaild'
import { searchUser, appnedUserData } from './models'
import { domain } from './varables'

import { fetch } from './utils/fetch'
import { TypeReq, TypeReqAuth, TypePayloadRes } from './@types/params'

const mode = process.env.mode!

export const loginRoute = async (
  { body: { mailid } }: TypeReq<{ mailid: string }>,
  res: Response
) => {
  try {
    const token = await login(mailid)

    if (mode === 'dev') {
      res.status(201).send(token)
      return
    }

    await sendMail({
      to: `${mailid}@${domain}`,
      text: `localhost:3000/main&token=${token}`,
    })

    res.status(201).end()
  } catch (e) {
    typeof e === 'number' ? res.status(e) : console.error(e)
  }
}

export const fetchRoute = async (
  { body }: TypeReqAuth,
  res: TypePayloadRes
) => {
  const data = await fetchAndParse(body)
  appnedUserData({ mailid: res.locals.mailid, data })
  res.status(201).send({ ...data })
}

export const cacheRoute = async (req: Request, res: TypePayloadRes) => {
  const data = await searchUser(res.locals.mailid)
  data ? res.status(200).send({ ...data }) : res.status(204).end()
}
