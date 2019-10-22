import { Request, Response } from 'express'
import { Dictionary } from 'lodash'
import { TypeUserNoPw } from './models'

export interface TypeReq<T> extends Request {
  body: T
}

export interface TypeGeneric<T> {
  body: T
}
