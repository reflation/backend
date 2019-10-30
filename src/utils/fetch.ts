import request from 'request'
import { base64Encode } from './base64'
import {
  oneDepthLiteral,
  TwoDepthLiteralArray,
  TypeList,
  TypeSearch,
} from './str2int'

import { TypeFechParam } from '../@types/params'

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

// post-processor
// TODO: use decorator pattern
const postList = (data: TypeList) => ({
  TERMNOW_DATA: TwoDepthLiteralArray(data.TERMNOW_DATA),
  PERSON_DATA: oneDepthLiteral(data.PERSON_DATA),
  TOP_DATA: oneDepthLiteral(data.TOP_DATA),
})

const postItem = (data: TypeSearch) => ({
  GRID_DATA: TwoDepthLiteralArray(data.GRID_DATA),
  BOTTOM_DATA: oneDepthLiteral(data.BOTTOM_DATA),
  TOP_DATA: oneDepthLiteral(data.TOP_DATA),
})

export const fetcher = ({ student_no, student_pw, form }: TypeFechParam) =>
  new Promise<object>(async (res, rej) => {
    try {
      const cookie = await getCookie(student_no.toString(), student_pw)
      request.post(
        `${BaseURL}/susj/sj/sta_sj_3230q.jejunu`,
        {
          rejectUnauthorized,
          form,
          headers: Object.assign(headers, {
            Cookie: `${cookie[0].substring(0, 19)} ${cookie[1]}`,
          }),
        },
        (_, __, body) => {
          const data = JSON.parse(body)
          res(form.mode === 'doSearch' ? postList(data) : postItem(data))
        }
      )
    } catch (e) {
      console.error(e)
    }
  })
