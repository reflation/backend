type SemesterCategory = '1학기' | '하기계절' | '2학기' | '동기계절'
type SemesterNum = 10 | 11 | 20 | 21
type RowCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
type Status = '재학' | '휴힉'
type Year = 2018 | 2019
type BoolInt = 0 | 1
type Point =
  | 4.3
  | 4.0
  | 3.7
  | 3.3
  | 3.0
  | 2.7
  | 2.3
  | 2.0
  | 1.7
  | 1.3
  | 1.0
  | 0.7
  | 0.0

type Univs =
  | '인문대학'
  | '사회과학대학'
  | '경상대학'
  | '사범대학'
  | '생명자원대학'
  | '해양과학대학'
  | '자연과학대학'
  | '공과대학'
  | '의과대학'
  | '교육대학'
  | '수의과대학'
  | '간호대학'
  | '예술대자인대학'
  | '미래융합대학'

export interface Grade {
  credit: 0 | 2 | 3 | 4
  dg_gb:
    | 'A+'
    | 'A0'
    | 'A-'
    | 'B+'
    | 'B0'
    | 'B-'
    | 'C+'
    | 'C0'
    | 'C-'
    | 'D+'
    | 'D0'
    | 'D-'
    | 'F'
  isu_cd:
    | 'A.기초교양'
    | 'B.전공탐색'
    | 'T.전인교양'
    | 'L.전공선택'
    | 'D.전공필수'
    | 'G.일반선택'
  isu_nm:
    | '기초교양'
    | '전공탐색'
    | '전인교양'
    | '전공선택'
    | '전공필수'
    | '일반선택'
  mark: Point
  rownum: RowCount
  subject_cd: string // 과목 코드
  subject_nm: string // 고목 이름
  term_gb: SemesterCategory
  year: Year
}

export interface ListItem {
  avg_mark: number
  get_credit: number
  outside_seq: 0 | 1
  rownum: RowCount
  term_gb: SemesterNum
  term_mn: SemesterCategory
  tot_mark: 32.3
  year: Year
}

export interface PersonalInfo {
  cls_cd: number
  cls_nm: string // 학과
  course_gb: number
  dbl_dept: string | null
  group_gb: number
  nm: string // 이름,
  nm_eng: string // 영문이름
  rownum: 0
  status_gb: Status
  status_gb2: 1 | 0
  stu_gb: 1
  student_no: number
  univ_cd: number
}

export interface ParentGradeProps {
  apply_credit: number
  avg_mark: number
  avg_mark45: number
  get_credit: number
  mark_credit: number
  rownum: 0
  tot_mark: number
}

export type PostprocessedList = {
  TERMNOW_DATA: ListItem[]
  PERSON_DATA: PersonalInfo
  TOP_DATA: ParentGradeProps
}

export interface CurrentSearchedGradeSummary extends ParentGradeProps {
  year: Year
  term_gb: SemesterCategory
  outside_gb?: '교류수학'
}

interface TotalGradeSummary extends ParentGradeProps {
  cls_cd: string
  grade: '1학년' | '2학년' | '3학년' | '4학년'
  nm: string
  rownum: 0
  status_gb: Status
  student_no: number
  univ_cd: Univs
}

export type PostprocessedItem = {
  GRID_DATA: Grade[]
  BOTTOM_DATA: CurrentSearchedGradeSummary
}
