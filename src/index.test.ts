import request from 'supertest'
import should from 'should'

import app from '.'
import { signToken } from './jwt'
import { TypeUser } from './@types/models'

interface TypeRes extends request.Response {
  body: TypeUser
}

const invaild = 'INVAILD'

jest.mock('./models')

describe('POST /login is', () => {
  const inVaild = { body: { mailid: 'muhunkim' }, code: 401 }
  const vaild = { body: { mailid: 'muhun' }, code: 201 }
  const wrapper = ({ body, code }: typeof vaild) =>
    describe(`body as '${JSON.stringify(body)}' send`, () => {
      it(`return ${code} status code`, done =>
        request(app)
          .post('/login')
          .send(body)
          .expect(code, done))
    })
  wrapper(inVaild)
  wrapper(vaild)
})

describe('POST /fetch is', () => {
  const student_no = parseInt(process.env.student_no!)
  const student_pw = process.env.student_pw!
  const form = { student_no, student_pw }
  describe('send vaild token', () => {
    let token: string
    beforeEach(() => {
      token = signToken('muhun')
    })

    it('return 201 status code', done =>
      request(app)
        .post('/fetch')
        .send(form)
        .set('Authorization', token)
        .expect(201)
        .end((err, res: TypeRes) => {
          done()
        }))
  })
  describe('send invaild token', () => {
    it('return 401 status code', done =>
      request(app)
        .post('/fetch')
        .send(form)
        .set('Authorization', 'INVAILD')
        .expect(401, done))
  })
})

describe('GET /load', () => {
  describe('send vaild token', () => {
    let token: string
    beforeEach(() => {
      token = signToken('muhun')
    })
    it('return 200 status code', done =>
      request(app)
        .get('/load')
        .set('Authorization', token)
        .expect(200)
        .end((err, res: TypeRes) => {
          done()
        }))
  })

  describe('send invaild token', () => {
    it('return 401 status code', done =>
      request(app)
        .get('/load')
        .set('Authorization', 'INVAILD')
        .expect(401, done))
  })
})
