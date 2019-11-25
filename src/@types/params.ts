import { Request, Response } from 'express'
import { Dictionary } from 'lodash'
import { UserNoPw } from './models'

export interface ReqAuth extends Request<Dictionary<string>> {
  body: UserNoPw
}

export interface Req<T> extends Request {
  body: T
}

export interface Res<T> extends Response {
  body: T
}

export type Payload = {
  mailid: string
  iat: number
  exp: number
}

export interface ResPayload extends Response {
  locals: Payload
}

export type SearchForm = {
  mode: 'doSearch'
}

export type ListForm = {
  mode: 'doList'
  year: number
  term_gb: 10 | 11 | 20 | 21
  outside_seq: 0 | 1
}

export interface FetchParam extends UserNoPw {
  form: SearchForm
}
