import express from 'express'

export interface TypeReq<T> extends express.Request {
  body: T
}

export type TypeRes = express.Response
