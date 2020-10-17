import { Request, Response } from 'express'
import { UserNoPw, User } from './models'

export interface ReqAuth extends Request {
  body: UserNoPw
}

export interface Req<T> extends Request {
  body: T
}

export interface Res<T> extends Response {
  body: T
}

export interface Payload {
  mailid: string
  iat: number
  exp: number
}

export interface ResPayload extends Response {
  locals: Payload
}

export interface SearchForm {
  mode: 'doSearch'
}

export interface ListForm {
  mode: 'doList'
  year: number
  term_gb: 10 | 11 | 20 | 21
  outside_seq: 0 | 1
}

export type ListFormOmit = Omit<ListForm, 'mode'>

export type SearchOrList = SearchForm | ListForm

export interface PostList extends Omit<User, 'semesters' | 'mailid'> {
  semestersReqParams: ListFormOmit[]
}

export interface FechParam extends UserNoPw {
  form: SearchOrList
}
