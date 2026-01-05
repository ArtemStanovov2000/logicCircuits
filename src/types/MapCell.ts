export type Id = {
    row: number
    column: number
}

export type controlledPointId = {
    row: number
    column: number
    type: 'drain' | 'contact' | 'output'
}

export type Transistor = {
    type: "transistor-close" | "transistor-open"
    drain: boolean
    source: boolean
    base: boolean
    orientation: "up" | "down" | "left" | "right",
    id: Id
    controlledBy: {
        base: controlledPointId[] // id транзисторов или контактов, управляющих моей base
        source: controlledPointId[] // id транзисторов или контактов, подключенных к моему source
    }
}

export type Contact = {
    type: 'contact' | 'output'
    isActive: boolean
    id: Id
    controlledBy: {
        connection : controlledPointId[] // id транзисторов или контактов, управляющих моим подключением
    }
}

export type MapCell = Transistor | Contact | null