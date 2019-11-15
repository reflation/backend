export interface Env extends NodeJS.ProcessEnv {
  service: 'gmail'
  user: string
  pass: string
  secret: string
}
