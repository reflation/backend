import request from 'request'

type TypeRes = {
  result: boolean
  isUserExist?: 'Y'
}

export const isNotVaild = (emailId: string) =>
  new Promise<boolean>((res, rej) => {
    request.post(
      'https://webmail.jejunu.ac.kr/idCheck.json',
      {
        form: { emailId },
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
