import { Request, Response } from 'express'
import { Dictionary } from 'lodash'
import { TypeUserNoPw } from './models'

export interface TypeReqAuth extends Request<Dictionary<string>> {
  body: TypeUserNoPw
}

export interface TypeReq<T> extends Request {
  body: T
}

export interface TypeRes<T> extends Response {
  body: T
}

export type TypePayload = {
  mailid: string
  iat: number
  exp: number
}

export interface TypePayloadRes extends Response {
  locals: TypePayload
}

export type TypeSearchForm = {
  mode: 'doSearch'
}

export type TypeListForm = {
  mode: 'doList'
  year: number
  term_gb: 10 | 11 | 20 | 21
  outside_seq: 0 | 1
}

export type TypeSearchOrList = TypeSearchForm | TypeListForm

export interface TypeFechParam extends TypeUserNoPw {
  form: TypeSearchOrList
}
