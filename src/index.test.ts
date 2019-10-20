import request from 'supertest'
import app from '.'

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
          .expect(code, done))
    })
  wrapper(inVaild)
  wrapper(vaild)
})
