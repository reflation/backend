import { TypeReq, TypeRes } from './@types/params'
import { sendMail } from './mail'
import { sign } from './jwt'
import { isMailVail } from './auth'

// Exported variable 'login' has or is using name 'e.Response' from external module "./node_modules/@types/express/index" but cannot be named in TS4023
export const LoginRoute = async ({ body }: TypeReq<string>, res: TypeRes) => {
  // TODO: check username from DB
  if (await isMailVail(body)) return res.send().status(403)
  const text = `localhost:3000/main&token=${await create(body)}`
  console.log(text)
  await sendMail({ to: req.body, text })
  res.send().status(200)
}
