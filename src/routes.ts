import dotenv from 'dotenv'

import { Request, Response } from 'express'

import { sendMail } from './mail'
import { signToken } from './jwt'
import { login } from './checkVaild'
import { createUser, searchUser, isUserExist, appnedUserData } from './models'
import { domain } from './varables'

import { fetchAndParse } from './utils/fetch'
import { TypeReq, TypeReqAuth, TypePayloadRes } from './@types/params'

const mode = process.env.mode!

export const loginRoute = async (
  { body: { mailid } }: TypeReq<{ mailid: string }>,
  res: Response
) => {
  try {
    const token = login(mailid)

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
  res.status(201).send({ gpa: data })
}

export const GPARoute = async (req: Request, res: TypePayloadRes) => {
  const { data } = await searchUser(res.locals.mailid)
  data ? res.status(200).send(data.toString()) : res.status(204).end()
}
