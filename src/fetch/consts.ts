export const BaseURL = 'https://dreamy.jejunu.ac.kr'
export const rejectUnauthorized = false
export const headers = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:70.0) Gecko/20100101 Firefox/70.0',
}

export const SESSION_EXPIRED = 'session expired'
export const INVALID_ACCOUNT = 'invalid account'

export const isFetch401 = (str: string) =>
  [SESSION_EXPIRED, INVALID_ACCOUNT].findIndex((item) => item === str) !== -1
