import { prisma } from './prisma'

import { TypeUser } from '../@types/models'

export const createUser = prisma.createUser

export const searchUser = async (mailid: string): Promise<TypeUser> => {
  const user = (await prisma.user({ mailid }).$fragment(`
  fragment TypeUser on User {
    mailid
    averagePoint
  }
  `)) as { mailid: string; averagePoint: number }
  if (!user) throw Error('No users found.')
  return {
    mailid: user.mailid,
    data: user.averagePoint,
  }
}

export const isUserExist = (mailid: string) => prisma.$exists.user({ mailid })

export const appnedUserData = ({ mailid, data }: TypeUser) =>
  prisma.updateUser({
    data: { averagePoint: data },
    where: { mailid },
  })
