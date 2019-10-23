import request from 'request'
import { base64Encode } from './base64'

import { TypeUserNoPw } from '../@types/models'

const BaseURL = 'https://dreamy.jejunu.ac.kr'
const rejectUnauthorized = false
const headers = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:70.0) Gecko/20100101 Firefox/70.0',
}

const getCookie = (id: string, pw: string) =>
  new Promise<string[]>((res, rej) => {
    request.post(
      `${BaseURL}/frame/sysUser.do?next=`,
      {
        rejectUnauthorized,
        form: { tmpu: base64Encode(id), tmpw: base64Encode(pw) },
        headers,
      },
      (err, { headers }, body: string) => {
        res(headers['set-cookie'])
      }
    )
  })

export const fetch = ({ student_no, student_pw }: TypeUserNoPw) =>
  new Promise<string>(async (res, rej) => {
    try {
      const cookie = await getCookie(student_no.toString(), student_pw)
      request.post(
        `${BaseURL}/hjju/hj/sta_hj_1010q.jejunu`,
        {
          rejectUnauthorized,
          form: { mode: 'doValue', student_no },
          headers: Object.assign(headers, {
            Cookie: `${cookie[0].substring(0, 19)} ${cookie[1]}`,
          }),
        },
        (_, __, body) => res(JSON.parse(body).CREDIT_SUBJECT[0].avg_mark)
      )
    } catch (e) {
      console.error(e)
    }
  })
