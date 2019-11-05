import { prisma, UserCreateInput, UserUpdateInput, User } from './prisma'

import { TypeUser } from '../@types/models'

export const createUser: (i: UserCreateInput) => Promise<User> =
  prisma.createUser

export const searchUser = async (mailid: string): Promise<TypeUser> => {
  const user = (await prisma.user({ mailid }).$fragment(`
  fragment TypeUser on User {
    mailid
    name
    averagePoint
    semesters {
      averagePoint
      totalCredit
      isOutside
      year
      semester
    }
  }
  `)) as TypeUser
  if (!user) throw Error('No users found.')

  return user
}

export const isUserExist = (mailid: string) => prisma.$exists.user({ mailid })

export const appnedUserData = (data: TypeUser): Promise<User> => {
  const query: UserUpdateInput = {
    ...data,
    semesters: {
      create: data.semesters, // Assuming there's none to update
    },
  }

  return prisma.updateUser({
    data: query,
    where: { mailid: data.mailid },
  })
}
