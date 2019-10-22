import { Request, Response } from 'express'
import { Dictionary } from 'lodash'
import { TypeUserNoPw } from './models'

export interface TypeReqAuth extends Request<Dictionary<string>> {
  body: TypeUserNoPw
}

export interface TypeReq<T> extends Request {
  body: T
}

export interface TypeGeneric<T> {
  body: T
}

export type TypePayload = {
  name: string
  iat: number
  exp: number
}

export interface TypePayloadRes extends Response {
  locals: TypePayload
}
