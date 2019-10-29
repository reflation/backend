import { prisma } from './prisma'

import { TypeUser } from '../@types/models'

export const createUser = prisma.createUser

export const searchUser = async (mailid: string): Promise<TypeUser> => {
  const user = await prisma.user({ mailid }).$fragment(`
  fragment TypeUser on User {
    name
    data
  }
  `)
  if (!user) throw Error('No users found.')
  return user as TypeUser
}

export const isUserExist = (mailid: string) => prisma.$exists.user({ mailid })

export const appnedUserData = ({ mailid, data }: TypeUser) =>
  prisma.updateUser({
    data: { averagePoint: data },
    where: { mailid },
  })
