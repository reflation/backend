import { TypeReq, TypeRes } from './@types/params'
import { sendMail } from './mail'
import { sign } from './jwt'

// Exported variable 'login' has or is using name 'e.Response' from external module "./node_modules/@types/express/index" but cannot be named in TS4023
export const LoginRoute = async (req: TypeReq<string>, res: TypeRes) => {
  const text = `localhost:3000/main&token=${await sign(req.body)}`
  console.log(text)
  await sendMail({ to: req.body, text })
  res.send().status(200)
}
