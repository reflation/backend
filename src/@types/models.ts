import { gradePoint, course } from './dreamy'

export interface TypeUserNoPw {
  student_no: number
  student_pw: string
}

type Subject = {
  title: string
  code: string
  grade: gradePoint
  type: course
}

export type TypeSemester = {
  subject: Subject[]
  averagePoint: number // Float
  totalCredit: number
  isOutside: boolean
  semester: 'FIRST' | 'SUMMER' | 'SECOND' | 'WINTER'
  year: number
}

export type TypeUser = {
  name: string | null
  mailid: string
  averagePoint: number // Float
  semesters: TypeSemester[] | null
}

export enum enumSemester {
  '1학기' = 'FIRST',
  '하기계절' = 'SUMMER',
  '2학기' = 'SECOND',
  '동기계절' = 'WINTER',
}
