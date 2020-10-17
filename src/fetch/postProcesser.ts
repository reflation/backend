import {
  oneDepthLiteral,
  twoDepthLiteralArray,
  List,
  Search,
} from '../utils/str2int'

import {
  PostprocessedItem,
  ListItem,
  PersonalInfo,
  ParentGradeProps,
  GradeSet,
  CurrentSearchedGradeSummary,
} from '../@types/dreamy'
import { EnumSemester, Semester } from '../@types/models'
import { PostList } from '../@types/params'

const postListItem = (list: ListItem[]) =>
  list.map(({ year, term_gb, outside_seq }) => ({
    year,
    term_gb,
    outside_seq,
  }))

// post-processor
// TODO: use decorator pattern to postprocessor
export const postList = ({
  TERMNOW_DATA,
  PERSON_DATA,
  TOP_DATA,
}: List): PostList => {
  const rawSemesters = twoDepthLiteralArray(TERMNOW_DATA) as ListItem[]

  const {
    nm: name,
    cls_nm: major,
    dbl_dept: subMajor,
    student_no: studentID,
    univ_nm: college,
  } = oneDepthLiteral(PERSON_DATA) as PersonalInfo

  const { avg_mark: averagePoint, tot_mark: totalPoint } = oneDepthLiteral(
    TOP_DATA
  ) as ParentGradeProps

  return {
    name,
    averagePoint,
    totalPoint,
    major,
    subMajor,
    studentID,
    college,
    semestersReqParams: postListItem(rawSemesters),
  }
}

export const postItem = (data: Search) => ({
  GRID_DATA: twoDepthLiteralArray(data.GRID_DATA) as GradeSet[],
  BOTTOM_DATA: oneDepthLiteral(data.BOTTOM_DATA) as CurrentSearchedGradeSummary,
})

// hack: Encoding Problem?
const semesterNumStr = {
  1: '1학기',
  2: '2학기',
  '1학기': '1학기',
  '2학기': '2학기',
  하기계절: '하기계절',
  동기계절: '동기계절',
} as const

export const postSemesters = (semesters: PostprocessedItem[]): Semester[] =>
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
      const subjects = GRID_DATA.map(
        ({
          subject_nm: title,
          subject_cd: code,
          dg_gb: grade,
          isu_nm: course,
        }) => ({ title, code, grade, course })
      ).filter((subject) => subject.grade !== 'S')
      return {
        subjects,
        averagePoint,
        totalCredit,
        isOutside: !!outside_gb,
        semester: EnumSemester[semesterNumStr[term_gb]],
        year,
      }
    }
  )
