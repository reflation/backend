type strLiteral = {
  [key: string]: string
}
type strOrNumLiteral = {
  [key: string]: string | number
}

export type TypeList = {
  TERMNOW_DATA: strLiteral[]
  PERSON_DATA: strLiteral
  TERM_DATA: null[]
  TOP_DATA: strLiteral
}

export type TypeSearch = {
  GRID_DATA: strLiteral[]
  BOTTOM_DATA: strLiteral
  TOP_DATA: strLiteral
}

export const oneDepthLiteral = (data: strLiteral) => {
  let result: strOrNumLiteral = {}
  Object.keys(data).forEach(key => {
    const value = data[key]
    if (value.length)
      // isNaN dosn't work with string parameter
      parseInt(value) || value === '0'
        ? (result[key] =
            value.indexOf('.') === -1 ? parseInt(value) : parseFloat(value))
        : (result[key] = value)
  })
  return result!
}

export const TwoDepthLiteralArray = (data: strLiteral[]) =>
  data.map(value => oneDepthLiteral(value))
