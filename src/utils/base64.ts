export const base64Encode = (data: string | object) => {
  let Bf: Buffer
  if (typeof data === 'string') Bf = Buffer.from(data)
  else Bf = Buffer.from(JSON.stringify(data))
  return Bf.toString('base64')
}

export const base64EncodeReplace = (data: string | object) =>
  base64Encode(data).replace('=', '')
