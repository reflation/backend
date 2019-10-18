import jwt from 'jsonwebtoken'

export const sign = (username: string) =>
  // @ts-ignore: 'rej' has 'any' type
  new Promise<string>((res, rej) => {
    jwt.sign(
      { username },
      'privatekey',
      {
        expiresIn: '1h',
      },
      (err, token) => (err ? rej(err) : res(token))
    )
  })
