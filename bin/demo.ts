import { fetchAndParse } from '../src/utils/fetch'
import dotenv from 'dotenv'

dotenv.config()

const studentAccount = {
  student_no: parseInt(process.env.student_no!),
  student_pw: process.env.student_pw!,
}

fetchAndParse(studentAccount)
  .then(data => console.log(data))
  .catch(e => console.error(e))
