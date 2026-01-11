export type Si = {
  type: "si";
}

export type P_si = {
  type: "p_si";
  value: boolean
}

export type Metal = {
  type: "metal";
  value: number,
  id?: {
    row: number
    column: number
  }
}

export type Source = {
  type: "source";
  value: number
  id: {
    row: number
    column: number
  }
}

export type Substrate = Si | Metal | P_si | Source
export type TemporaryArray = Metal | P_si | Source
