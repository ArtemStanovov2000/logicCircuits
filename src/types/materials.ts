export type Id = {
  row: number
  column: number
  layer: number
}

export type Dependencie = {
  value: number;
  sourceLabel: string
}

export type Metal = {
  type: "metal"
  dependencies: Dependencie[]
  id: Id
}

export type Si = {
  type: "si"
  dependencies: Dependencie[]
  id: Id
}

export type Layer = Array<Metal | Si>