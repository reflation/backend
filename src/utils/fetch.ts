import request from 'request'
import { base64Encode } from './base64'

import { oneDepthLiteral, twoDepthLiteralArray, List, Search } from './str2int'

import { FechParam, ListForm } from '../@types/params'
import {
  PostprocessedList,
  PostprocessedItem,
  ListItem,
  PersonalInfo,
  ParentGradeProps,
  GradeSet,
  CurrentSearchedGradeSummary,
} from '../@types/dreamy'
import { UserNoPw, User, EnumSemester, Semester } from '../@types/models'

const BaseURL = 'https://dreamy.jejunu.ac.kr'
const rejectUnauthorized = false
const headers = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:70.0) Gecko/20100101 Firefox/70.0',
}

const SESSION_EXPIRED = 'session expired'
const INVALID_ACCOUNT = 'invalid account'

export const isFetch401 = (str: string) =>
  [SESSION_EXPIRED, INVALID_ACCOUNT].findIndex(item => item === str) !== -1

// hack: Encoding Problem?
const semesterNumStr = {
  1: '1학기' as '1학기',
  2: '2학기' as '2학기',
  '1학기': '1학기' as '1학기',
  '2학기': '2학기' as '2학기',
  하기계절: '하기계절' as '하기계절',
  동기계절: '동기계절' as '동기계절',
}

type FetchSemesterParams = {
  cookie: string
  data: Omit<ListForm, 'mode'>
}

const getCookie = ({ student_no, student_pw }: UserNoPw) =>
  new Promise<string>((res, rej) => {
    request.post(
      `${BaseURL}/frame/sysUser.do?next=`,
      {
        rejectUnauthorized,
        form: {
          tmpu: base64Encode(student_no.toString()),
          tmpw: base64Encode(student_pw),
        },
        headers,
      },
      (err, { headers }, body: string) => {
        if (typeof body === 'string' && body.includes('dbError')) {
          rej({
            type: INVALID_ACCOUNT,
            message: (body.match(
              /var dbError = "(?:\.|(\\\")|[^\""\n])*"/
            ) as RegExpMatchArray)[0].slice(15, -1),
          })
          return
        }
        const cookie = headers['set-cookie']!
        cookie
          ? res(`${cookie[0].substring(0, 19)} ${cookie[1]}`)
          : rej({ type: SESSION_EXPIRED })
      }
    )
  })

// post-processor
// TODO: use decorator pattern to postprocessor
const postList = (data: List): PostprocessedList => ({
  TERMNOW_DATA: twoDepthLiteralArray(data.TERMNOW_DATA) as ListItem[],
  PERSON_DATA: oneDepthLiteral(data.PERSON_DATA) as PersonalInfo,
  TOP_DATA: oneDepthLiteral(data.TOP_DATA) as ParentGradeProps,
})

const postItem = (data: Search): PostprocessedItem => ({
  GRID_DATA: twoDepthLiteralArray(data.GRID_DATA) as GradeSet[],
  BOTTOM_DATA: oneDepthLiteral(data.BOTTOM_DATA) as CurrentSearchedGradeSummary,
})

export const listFetcher = ({ form, ...account }: FechParam) =>
  new Promise<{ data: PostprocessedList; cookie: string }>(async (res, rej) => {
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
  new Promise<PostprocessedItem>(async (res, rej) => {
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

const fetchSemester = ({ cookie, data }: FetchSemesterParams) =>
  itemFetcher({
    form: { mode: 'doList', ...data },
    cookie,
  })

const postSemester = (semesters: PostprocessedItem[]) =>
  semesters.map(
    ({
      GRID_DATA,
      BOTTOM_DATA: {
        avg_mark: averagePoint,
        apply_credit: totalCredit,
        term_gb,
        year,
        outside_gb,
      },
    }) => {
      const subject = GRID_DATA.map(
        ({
          subject_nm: title,
          subject_cd: code,
          dg_gb: grade,
          isu_nm: type,
        }) => ({ title, code, grade, type })
      )
      return {
        subject,
        averagePoint,
        totalCredit,
        isOutside: !!outside_gb,
        semester: EnumSemester[semesterNumStr[term_gb]],
        year,
      }
    }
  )

const postListItem = (list: ListItem[]) =>
  list.map(({ year, term_gb, outside_seq }) => ({
    year,
    term_gb,
    outside_seq,
  }))

export const fetchAndParse = async (account: UserNoPw) => {
  const {
    data: {
      TOP_DATA: { avg_mark: averagePoint },
      TERMNOW_DATA: listItem,
      PERSON_DATA: { nm: name },
    },
    cookie,
  } = await fetchList(account)

  const fetchedSemester = await Promise.all(
    postListItem(listItem).map(data => fetchSemester({ cookie, data }))
  )

  return { name, averagePoint, semesters: postSemester(fetchedSemester) }
}
