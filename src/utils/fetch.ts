import request from 'request'
import { base64Encode } from './base64'

import {
  oneDepthLiteral,
  TwoDepthLiteralArray,
  TypeList,
  TypeSearch,
} from './str2int'

import { TypeFechParam, TypeListForm } from '../@types/params'
import {
  PostprocessedList,
  PostprocessedItem,
  listItem,
  personalInfo,
  parent_grade_props,
  gradeSet,
  current_searched_grade_summary,
} from '../@types/dreamy'
import {
  TypeUserNoPw,
  TypeUser,
  enumSemester,
  TypeSemester,
} from '../@types/models'

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

type TypefetchSemesterParams = {
  cookie: string
  data: Omit<TypeListForm, 'mode'>
}

const getCookie = ({ student_no, student_pw }: TypeUserNoPw) =>
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
const postList = (data: TypeList): PostprocessedList => ({
  TERMNOW_DATA: TwoDepthLiteralArray(data.TERMNOW_DATA) as listItem[],
  PERSON_DATA: oneDepthLiteral(data.PERSON_DATA) as personalInfo,
  TOP_DATA: oneDepthLiteral(data.TOP_DATA) as parent_grade_props,
})

const postItem = (data: TypeSearch): PostprocessedItem => ({
  GRID_DATA: TwoDepthLiteralArray(data.GRID_DATA) as gradeSet[],
  BOTTOM_DATA: oneDepthLiteral(
    data.BOTTOM_DATA
  ) as current_searched_grade_summary,
})

export const listFetcher = ({ form, ...account }: TypeFechParam) =>
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
  form: TypeListForm
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

const fetchList = (data: TypeUserNoPw) =>
  listFetcher({ ...data, form: { mode: 'doSearch' } })

const fetchSemester = ({ cookie, data }: TypefetchSemesterParams) =>
  itemFetcher({
    form: { mode: 'doList', ...data },
    cookie,
  })

export const fetchAndParse = async (account: TypeUserNoPw) => {
  const { data, cookie } = await fetchList(account)
  const {
    TOP_DATA: { avg_mark: averagePoint },
    TERMNOW_DATA,
    PERSON_DATA: { nm: name },
  } = data

  const eachSemesterRequireProps = TERMNOW_DATA.map(
    ({ year, term_gb, outside_seq }) => ({
      year,
      term_gb,
      outside_seq,
    })
  )

  const fetchedSemester = await Promise.all(
    eachSemesterRequireProps.map(data => fetchSemester({ cookie, data }))
  )

  const semesters = fetchedSemester.map(
    ({
      BOTTOM_DATA: {
        avg_mark: averagePoint,
        apply_credit: totalCredit,
        term_gb,
        year,
        outside_gb,
      },
    }) => ({
      averagePoint,
      totalCredit,
      isOutside: !!outside_gb,
      semester: enumSemester[semesterNumStr[term_gb]],
      year,
    })
  )
  return { name, averagePoint, semesters }
}
