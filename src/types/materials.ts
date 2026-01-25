export type Si = {
  type: "si";
}

export type P_si = {
  type: "p_si";
  value: number
}

export type Metal = {
  type: "metal";
  value: number,
  dependencies: string[]
  id?: {
    row: number
    column: number
  }
}

export type Source = {
  type: "source";
  value: number
}

export type ContactsForArray = {
  label: string,
  id: {
    row: number,
    column: number,
  }
}

export type Contacts = {
  value: number,
  id: {
    row: number,
    column: number,
  }
}

export type Substrate = Si | Metal | P_si | Source

export type TemporaryArrayContact =
  {
    type: "contact",
    label: string,
    value: number
  }

  export type TemporaryArray =
  {
    type: "source" | "metal" | "p_si",
    dependencies: string[]
    value: number,
    id: {
      row: number,
      column: number,
    }
  }

