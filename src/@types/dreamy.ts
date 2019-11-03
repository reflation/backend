type tSemester = '1학기' | '하기계절' | '2학기' | '동기계절'
type tSemesterNum = 10 | 11 | 20 | 21
type tRowCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
type tStatus = '재학' | '휴힉'
type tYear = 2018 | 2019
type tBoolInt = 0 | 1
type point =
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

type tUnivs =
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

export interface grade {
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
  mark: point
  rownum: tRowCount
  subject_cd: string // 과목 코드
  subject_nm: string // 고목 이름
  term_gb: tSemester
  year: tYear
}

export interface listItem {
  avg_mark: number
  get_credit: number
  outside_seq: 0 | 1
  rownum: tRowCount
  term_gb: tSemesterNum
  term_mn: tSemester
  tot_mark: 32.3
  year: tYear
}

export interface personalInfo {
  cls_cd: number
  cls_nm: string // 학과
  course_gb: number
  dbl_dept: string | null
  group_gb: number
  nm: string // 이름,
  nm_eng: string // 영문이름
  rownum: 0
  status_gb: tStatus
  status_gb2: 1 | 0
  stu_gb: 1
  student_no: number
  univ_cd: number
}

export interface parent_grade_props {
  apply_credit: number
  avg_mark: number
  avg_mark45: number
  get_credit: number
  mark_credit: number
  rownum: 0
  tot_mark: number
}

export type PostprocessedList = {
  TERMNOW_DATA: listItem[]
  PERSON_DATA: personalInfo
  TOP_DATA: parent_grade_props
}

export interface current_searched_grade_summary extends parent_grade_props {
  year: tYear
  term_gb: tSemester
  outside_gb?: '교류수학'
}

interface total_grade_summery extends parent_grade_props {
  cls_cd: string
  grade: '1학년' | '2학년' | '3학년' | '4학년'
  nm: string
  rownum: 0
  status_gb: tStatus
  student_no: tYmber
  univ_cd: tUnivs
}

export type PostprocessedItem = {
  GRID_DATA: grade[]
  BOTTOM_DATA: current_searched_grade_summary
}
