import { TypeReq, TypeRes } from './@types/params'
import { sendMail } from './mail'
import { create } from './jwt'
import { isNotVaild } from './auth'

// Exported variable 'login' has or is using name 'e.Response' from external module "./node_modules/@types/express/index" but cannot be named in TS4023
export const LoginRoute = async ({ body }: TypeReq<string>, res: TypeRes) => {
  // TODO: check username from DB
  const to = `${body}@jejunu.ac.kr`
  if (await isNotVaild(to)) return res.status(401).send()
  const text = `localhost:3000/main&token=${await create(body)}`
  await sendMail({ to, text })
  res.status(201).send()
}
