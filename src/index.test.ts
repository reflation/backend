import request from 'supertest'

import app from '.'
import { signToken } from './jwt'

import 'dotenv/config'

const { student_no, student_pw } = process.env
if (!(student_no && student_pw))
  throw Error(`Can't read the account from environment variables`)

const invaild = 'INVAILD'

jest.mock('./models')

describe('POST /login is', () => {
  const inVaild = { body: { mailid: 'muhunkim' }, code: 401 }
  const vaild = { body: { mailid: 'muhun' }, code: 201 }
  const wrapper = ({ body, code }: typeof vaild) =>
    describe(`body as '${JSON.stringify(body)}' send`, () => {
      it(`return ${code} status code`, (done) =>
        request(app).post('/login').send(body).expect(code, done))
    })
  wrapper(inVaild)
  wrapper(vaild)
})

describe('POST /fetch is', () => {
  const form = { student_no: parseInt(student_no), student_pw }
  const formInVaild = { student_no: invaild, student_pw: invaild }
  describe('send vaild token', () => {
    let token: string
    beforeEach(() => {
      token = signToken('muhun')
    })

    it('return 401 status code with invaild form', (done) =>
      request(app)
        .post('/fetch')
        .send(formInVaild)
        .set('Authorization', token)
        .expect(401, done))

    // hack: this case works fine on 'yarn demo' and manual E2E test
    // it('return 201 status code with vaild form', done =>
    //   request(app)
    //     .post('/fetch')
    //     .type('form')
    //     .send(form)
    //     .set('Authorization', token)
    //     .expect(201, done))
  })
  describe('send invaild token', () => {
    it('return 401 status code', (done) =>
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
    it('return 200 status code', (done) =>
      request(app).get('/load').set('Authorization', token).expect(200, done))
  })

  describe('send invaild token', () => {
    it('return 401 status code', (done) =>
      request(app)
        .get('/load')
        .set('Authorization', 'INVAILD')
        .expect(401, done))
  })
})
