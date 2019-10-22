import request from 'supertest'
import should from 'should'

import app from '.'
import { TypeUser } from './@types/models'
import { TypeGeneric } from './@types/params'

// TODO: clear database before/after test execute
// import fs from 'fs'
// import path from 'path'
// const dbPath = path.resolve(__dirname, 'models/db.json')
// fs.unlinkSync(dbPath)

let token: string
const invaild = 'INVAILD'

describe('POST /login is', () => {
  const inVaild = { body: 'muhunkim', code: 401 }
  const vaild = { body: 'muhun', code: 201 }
  const wrapper = ({ body, code }: typeof vaild) =>
    describe(`body as '${body}' send`, () => {
      it(`return ${code} status code`, done =>
        request(app)
          .post('/login')
          .type('text')
          .send(body)
          .expect(code)
          .end((err, { body }: { body: string }) => {
            token = body
            done()
          }))
    })
  wrapper(inVaild)
  wrapper(vaild)
})

describe('POST /fetch is', () => {
  const student_no = parseInt(process.env.student_no!)
  const student_pw = process.env.student_pw!
  const form = { student_no, student_pw }

  describe('send vaild token', () => {
    it('return 201 status code', done =>
      request(app)
        .post('/fetch')
        .send(form)
        .set('Authorization', token)
        .expect(201)
        .end((err, { body }: TypeGeneric<string>) => {
          should(body)
            .be.String()
            .length(3)
          done()
        }))
  })
  describe('send invaild token', () => {
    it('return 401 status code', done =>
      request(app)
        .post('/fetch')
        .send(form)
        .set('Authorization', invaild)
        .expect(401, done))
  })
})

describe('GET /GPA', () => {
  describe('send vaild token', () => {
    it('return 200 status code', done =>
      request(app)
        .get('/GPA')
        .set('Authorization', token)
        .expect(200)
        .end((err, { body }: TypeGeneric<string>) => {
          should(body)
            .be.String()
            .length(3)
          done()
        }))
  })
  describe('send invaild token', () => {
    it('return 401 status code', done =>
      request(app)
        .get('/GPA')
        .set('Authorization', invaild)
        .expect(401, done))
  })
})

// fs.unlinkSync(dbPath)
