import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import Mail from 'nodemailer/lib/mailer'

// import { TypeEnv } from './@types/env'

dotenv.config()
// TODO FIX: Type 'ProcessEnv' is missing the following properties from type 'TypeEnv': service, user, pass, secret
// const { service, user, pass }: TypeEnv = process.env
const service = process.env.service!
const user = process.env.user!
const pass = process.env.pass!

type TypeMailContent = {
  to: string
  text: string
  html?: string
}

const client = nodemailer.createTransport({
  service,
  auth: { user, pass },
})

// @ts-ignore: Promise<any>
export const sendMail = ({ to, text, html }: TypeMailContent) =>
  client.sendMail({
    from: `${user}@${service}.com`,
    to,
    subject: '[dream-plus] 이메일 토큰',
    text,
    html: html || text,
  })
