import request from 'request'
import { domain } from './varables'
import { isUserExist, createUser } from './models'

type TypeRes = {
  result: boolean
  isUserExist?: 'Y'
}

const isNotVaild = (mailid: string) =>
  new Promise<boolean>((res, rej) => {
    request.post(
      'https://webmail.jejunu.ac.kr/idCheck.json',
      {
        form: { emailId: mailid },
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:70.0) Gecko/20100101 Firefox/70.0',
        },
        // TODO: use below option
        // jsonReviver: (body: string) => JSON.parse(body),
      },
      (err, req, body: string) => {
        const { result }: TypeRes = JSON.parse(body)
        res(result)
      }
    )
  })

export const login = async (mailid: string) => {
  const mailAddress = `${mailid}@${domain}`
  if (await isNotVaild(mailAddress)) throw 401
  try {
    if (!(await isUserExist(mailAddress))) await createUser({ mailid })
  } catch (e) {
    throw 501
  }
}
