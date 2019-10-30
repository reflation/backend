import { fetcher } from '../src/utils/fetch'
import dotenv from 'dotenv'

dotenv.config()

const student_no = parseInt(process.env.student_no!)
const student_pw = process.env.student_pw!

const main = async () => {
  console.log(
    await fetcher({ student_no, student_pw, form: { mode: 'doSearch' } })
  )
}

main().catch(e => console.error(e))
