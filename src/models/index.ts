import { prisma } from './prisma'

import { TypeUser } from '../@types/models'

export const createUser = prisma.createUser

export const searchUser = async (name: string): Promise<TypeUser> => {
  const user = await prisma.user({ name }).$fragment(`
  fragment TypeUser on User {
    name
    data
  }
  `)
  if (!user) throw Error('No users found.')
  return user as TypeUser
}

export const isUserExist = (name: string) => prisma.$exists.user({ name })

export const appnedUserData = ({ name, data }: TypeUser) =>
  prisma.updateUser({
    data: { data },
    where: { name },
  })
