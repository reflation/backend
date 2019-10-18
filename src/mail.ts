import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import Mail from 'nodemailer/lib/mailer'

dotenv.config()
const { service, user, pass } = process.env

type TypeMailContent = {
  to: string
  text: string
  html?: string
}

// TODO: declare res function types into 'nodemailer/lib/mailer'
// type TypeSendRes = {
//   accept: string[]
//   reject: [] | string[]
//   envelopeTime: number
//   messageTime: number
//   messageSize: number
//   response: string
//   envelope: {
//     // sender email
//     from: string
//     // recever email
//     to: string[]
//   }
//   messageId: string
// }

const client = nodemailer.createTransport({
  service,
  auth: { user, pass },
})

export const sendMail = async ({ to, text, html }: TypeMailContent) => {
  // @ts-ignore: Promise<any>
  await client.sendMail({
    from: `${service}@${user}.com`,
    to,
    subject: '[dream-plus] 이메일 토큰',
    text,
    html: html || text,
  })
  console.log(a)
}
