import { User, UserCreateInput, UserPromise } from '../prisma'
import { TypeUser } from '../../@types/models'
import cuid from 'cuid'

const users: User[] = [
  {
    id: 'ck2bz0s449a4v0919xqvuzht9',
    createdAt: '2019-10-29T14:53:17.524Z',
    mailid: 'muhun',
    name: '무훈',
    averagePoint: 4.2,
  },
]

export const createUser = async (input: UserCreateInput): Promise<User> => {
  if (isUserExist(input.mailid))
    throw Error('The user with same mailid already exists.')
  const user: User = {
    createdAt: new Date().toISOString(),
    ...input,
    averagePoint: input.averagePoint || 4.2,
    name: input.name || undefined,
    id: input.id ? input.id.toString() : cuid(),
  }
  users.push(user)
  return user
}

export const searchUser = async (mailid: string): Promise<TypeUser> => {
  const user = users.find(user => user.mailid === mailid)
  if (!user) throw Error('Cannot find the ' + mailid)
  return {
    mailid: user.mailid,
    data: user.averagePoint,
  }
}

export const isUserExist = async (mailid: string) =>
  users.some(user => user.mailid === mailid)

export const appendUserData = async ({
  mailid,
  data,
}: TypeUser): Promise<User> => {
  const foundIndex = users.findIndex(user => user.mailid === mailid)
  users[foundIndex].averagePoint = data || 4.2
  return users[foundIndex]
}
