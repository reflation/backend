import nodemailer from 'nodemailer'
import 'dotenv/config'

const { service, user, pass } = process.env

if (!(service && user && pass))
  throw Error(`Can't read the mail account from environment variables`)

type TypeMailContent = {
  to: string
  text: string
  html?: string
}

const client = nodemailer.createTransport({
  service,
  auth: { user, pass },
})

export const sendMail = ({ to, text, html }: TypeMailContent) =>
  client.sendMail({
    from: `${user}@${service}.com`,
    to,
    subject: '[dream-plus] 이메일 토큰',
    text,
    html: html || text,
  })
