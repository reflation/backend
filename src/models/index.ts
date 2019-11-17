import {
  prisma,
  UserCreateInput,
  UserUpdateInput,
  User as PrismaUser,
} from './prisma'

import { User } from '../@types/models'

export const createUser: (i: UserCreateInput) => Promise<PrismaUser> =
  prisma.createUser

export const searchUser = async (mailid: string): Promise<User> => {
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
  `)) as User
  if (!user) throw Error('No users found.')

  return user
}

export const isUserExist = (mailid: string) => prisma.$exists.user({ mailid })

export const appnedUserData = (data: User): Promise<PrismaUser> => {
  if (!data.semesters) data.semesters = []

  const query: UserUpdateInput = {
    ...data,
    semesters: {
      create: data.semesters.map(semester => ({
        ...semester,
        subjects: {
          create: semester.subjects,
        },
      })), // Assuming there's none to update
    },
  }

  return prisma.updateUser({
    data: query,
    where: { mailid: data.mailid },
  })
}
