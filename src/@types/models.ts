export interface TypeUserNoPw {
  student_no: number
  student_pw: string
}

export type TypeUser = {
  name: string
  averagePoint: number // Float
  semesters: TypeSemester[]
}

export enum enumSemester {
  '1학기' = 'FIRST',
  '하기계절' = 'SUMMER',
  '2학기' = 'SECOND',
  '동기계절' = 'WINTER',
}

type TypeSemester = {
  averagePoint: number // Float
  totalCredit: number
  isOutside: boolean
  semester: 'FIRST' | 'SUMMER' | 'SECOND' | 'WINTER'
  year: number
}
