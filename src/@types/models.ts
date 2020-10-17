import { GradePoint, Course, College } from './dreamy'

export interface UserNoPw {
  student_no: number
  student_pw: string
}

interface Subject {
  title: string
  code: string
  grade: GradePoint
  course: Course
}

export interface Semester {
  subjects: Subject[]
  averagePoint: number
  totalCredit: number
  isOutside: boolean
  semester: 'FIRST' | 'SUMMER' | 'SECOND' | 'WINTER'
  year: number
}

export interface User {
  name: string | null
  mailid: string
  studentID: number
  averagePoint: number
  totalPoint: number
  major: string
  subMajor: string | null
  college: College
  semesters: Semester[] | null
}

export enum EnumSemester {
  '1학기' = 'FIRST',
  '하기계절' = 'SUMMER',
  '2학기' = 'SECOND',
  '동기계절' = 'WINTER',
}
