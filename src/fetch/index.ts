import request from 'request'

import { FechParam, ListForm, ListFormOmit, PostList } from '../@types/params'
import { PostprocessedItem } from '../@types/dreamy'
import { UserNoPw, User } from '../@types/models'

import {
  BaseURL,
  rejectUnauthorized,
  headers,
  SESSION_EXPIRED,
  INVALID_ACCOUNT,
} from './consts'

import { postList, postItem, postSemesters } from './postProcesser'

type FetchSemesterParams = {
  cookie: string
  params: ListFormOmit
}

const getCookie = ({ student_no, student_pw }: UserNoPw) =>
  new Promise<string>((res, rej) => {
    request.post(
      `${BaseURL}/frame/sysUser.do?next=`,
      {
        rejectUnauthorized,
        form: {
          tmpu: Buffer.from(student_no.toString()).toString('base64'),
          tmpw: Buffer.from(student_pw).toString('base64'),
        },
        headers,
      },
      (err, { headers }, body: string) => {
        if (typeof body === 'string' && body.includes('dbError')) {
          const matchArray = body.match(/var dbError = "(?:\.|(\\")|[^""\n])*"/)
          if (matchArray) {
            rej({
              type: INVALID_ACCOUNT,
              message: matchArray[0].slice(15, -1),
            })
            return
          }
          rej('unexpected flow')
        }
        const cookie = headers['set-cookie']
        cookie
          ? res(`${cookie[0].substring(0, 19)} ${cookie[1]}`)
          : rej({ type: SESSION_EXPIRED })
      }
    )
  })

const listFetcher = ({ form, ...account }: FechParam) =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise<{ data: PostList; cookie: string }>(async (res, rej) => {
    const cookie = await getCookie(account)
    request.post(
      `${BaseURL}/susj/sj/sta_sj_3230q.jejunu`,
      {
        rejectUnauthorized,
        form,
        headers: Object.assign(headers, { Cookie: cookie }),
      },
      (_, __, body: string) => {
        body[0] === '<'
          ? rej({ type: SESSION_EXPIRED })
          : res({ data: postList(JSON.parse(body)), cookie })
      }
    )
  })

export const itemFetcher = ({
  form,
  cookie,
}: {
  form: ListForm
  cookie: string
}) =>
  new Promise<PostprocessedItem>((res, rej) => {
    request.post(
      `${BaseURL}/susj/sj/sta_sj_3220q.jejunu`,
      {
        rejectUnauthorized,
        form,
        headers: Object.assign(headers, {
          Cookie: cookie,
        }),
      },
      (_, __, body: string) => {
        body[0] === '<'
          ? rej({ type: SESSION_EXPIRED })
          : res(postItem(JSON.parse(body)))
      }
    )
  })

const fetchList = (data: UserNoPw) =>
  listFetcher({ ...data, form: { mode: 'doSearch' } })

const fetchSemester = ({ cookie, params }: FetchSemesterParams) =>
  itemFetcher({
    form: { mode: 'doList', ...params },
    cookie,
  })

export const fetchAndParse = async (
  account: UserNoPw
): Promise<Omit<User, 'mailid'>> => {
  const {
    data: { semestersReqParams, ...user },
    cookie,
  } = await fetchList(account)

  const rawSemester = await Promise.all(
    semestersReqParams.map((params) => fetchSemester({ cookie, params }))
  )
  return { ...user, semesters: postSemesters(rawSemester) }
}
