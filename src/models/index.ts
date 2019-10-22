import low from 'lowdb'
import path from 'path'
import FileSync from 'lowdb/adapters/FileSync'

import { TypeUser } from '../@types/models'

const db = low(new FileSync(path.resolve(__dirname, 'db.json')))

db.defaults({ user: [] }).write()

export const createUser = (data: TypeUser) =>
  db
    .get('user')
    .push(data)
    .write()

export const searchUser = (name: string): TypeUser =>
  db
    .get('user')
    .find({ name })
    // @ts-ignore
    .value()

export const isUserNotExist = (name: string) => !searchUser(name)

export const appnedUserData = ({ name, data }: TypeUser) =>
  db
    .get('user')
    .find({ name })
    .assign({ data })
    .write()
