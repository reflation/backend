import { User, UserCreateInput, UserPromise } from '../prisma'
import { TypeUser } from '../../@types/models'
import cuid from 'cuid'

const users: User[] = [
  {
    id: 'ck2bz0s449a4v0919xqvuzht9',
    createdAt: '2019-10-29T14:53:17.524Z',
    mailid: 'muhun',
    name: '김무훈',
    averagePoint: 3.5,
  },
]

export const createUser = (input: UserCreateInput) =>
  new Promise<User>((res, rej) => {
    if (isUserExist(input.mailid))
      rej(new Error('The user with same mailid already exists.'))
    const user: User = {
      createdAt: new Date().toISOString(),
      ...input,
      averagePoint: input.averagePoint || 3.5,
      name: input.name || undefined,
      id: input.id ? input.id.toString() : cuid(),
    }
    users.push(user)
    res(user)
  })

export const searchUser = async (mailid: string): Promise<TypeUser> => {
  const user = users.find(user => user.mailid === mailid)
  if (!user) throw Error('Cannot find the ' + mailid)
  return {
    mailid: user.mailid,
    data: user.averagePoint,
  }
}

export const isUserExist = (mailid: string) =>
  Promise.resolve(users.some(user => user.mailid === mailid))

export const appendUserData = (data: TypeUser) =>
  new Promise<User>(res => {
    const { mailid, ...others } = data
    const foundIndex = users.findIndex(user => user.mailid === mailid)
    Object.keys(others).forEach(key => {
      user[foundIndex][key] = others[key]
    })
    res(users[foundIndex])
  })
