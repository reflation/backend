import { fetchAndParse } from '../src/fetch'
import 'dotenv/config'

const { student_no, student_pw } = process.env

if (!(student_no && student_pw))
  throw Error(`Can't read the account from environment variables`)

const studentAccount = {
  student_no: parseInt(student_no),
  student_pw: student_pw,
}

fetchAndParse(studentAccount)
  .then((data) => console.log(data))
  .catch((e) => console.error(e))
