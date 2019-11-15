type Literal = Record<string, string>
type NumLiteral = {
  [key: string]: string | number
}

export type List = {
  TERMNOW_DATA: Literal[]
  PERSON_DATA: Literal
  TERM_DATA: null[]
  TOP_DATA: Literal
}

export type Search = {
  GRID_DATA: Literal[]
  BOTTOM_DATA: Literal
  TOP_DATA: Literal
}

// hack(unknown type): type safely for '../@types/dreamy.ts': type 'PostprocessedList' or 'PostprocessedItem'
export const oneDepthLiteral = (data: Literal): unknown => {
  let result: NumLiteral = {}
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

export const TwoDepthLiteralArray = (data: Literal[]) =>
  data.map(value => oneDepthLiteral(value))
