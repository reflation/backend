export interface UserNoPw {
  student_no: number
  student_pw: string
}

export type Semester = {
  averagePoint: number // Float
  totalCredit: number
  isOutside: boolean
  semester: 'FIRST' | 'SUMMER' | 'SECOND' | 'WINTER'
  year: number
}

export type User = {
  name: string | null
  mailid: string
  averagePoint: number // Float
  semesters: Semester[] | null
}

export enum EnumSemester {
  '1학기' = 'FIRST',
  '하기계절' = 'SUMMER',
  '2학기' = 'SECOND',
  '동기계절' = 'WINTER',
}
