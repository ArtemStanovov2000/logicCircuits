import type { MapCell } from "../types/MapCell"

export const map: MapCell[][] = []

const WIDTH = 100
const HEIGHT = 100

for (let i = 0; i < WIDTH; i++) {
    const row: MapCell[] = []
    for (let j = 0; j < HEIGHT; j++) {
        row.push(null)
    }
    map.push(row)
}

map[1][3] = {
    type: 'contact',
    id: { row: 1, column: 3 },
    isActive: true,
    controlledBy: {
        connection: [],
    }
}

map[1][5] = {
    type: 'contact',
    id: { row: 1, column: 5 },
    isActive: false,
    controlledBy: {
        connection: [],
    }
}

map[1][2] = {
    type: 'contact',
    id: { row: 1, column: 2 },
    isActive: false,
    controlledBy: {
        connection: [],
    }
}

map[3][2] = {
    type: "transistor-open",
    drain: false,
    source: false,
    base: false,
    orientation: "down",
    id: { row: 3, column: 2 },
    controlledBy: {
        base: [],
        source: []
    }
}

map[3][5] = {
    type: "transistor-open",
    drain: false,
    source: false,
    base: false,
    orientation: "down",
    id: { row: 3, column: 5 },
    controlledBy: {
        base: [],
        source: []
    }
}

map[5][2] = {
    type: "transistor-close",
    drain: false,
    source: false,
    base: false,
    orientation: "down",
    id: { row: 5, column: 2 },
    controlledBy: {
        base: [],
        source: []
    }
}

map[5][3] = {
    type: "transistor-close",
    drain: false,
    source: false,
    base: false,
    orientation: "down",
    id: { row: 5, column: 3 },
    controlledBy: {
        base: [],
        source: []
    }
}

map[5][4] = {
    type: "transistor-close",
    drain: false,
    source: false,
    base: false,
    orientation: "down",
    id: { row: 5, column: 4 },
    controlledBy: {
        base: [],
        source: []
    }
}

map[5][5] = {
    type: "transistor-close",
    drain: false,
    source: false,
    base: false,
    orientation: "down",
    id: { row: 5, column: 5 },
    controlledBy: {
        base: [],
        source: []
    }
}


map[7][3] = {
    type: "transistor-close",
    drain: false,
    source: false,
    base: false,
    orientation: "down",
    id: { row: 7, column: 3 },
    controlledBy: {
        base: [],
        source: []
    }
}

map[7][4] = {
    type: "transistor-close",
    drain: false,
    source: false,
    base: false,
    orientation: "down",
    id: { row: 7, column: 4 },
    controlledBy: {
        base: [],
        source: []
    }
}

map[9][4] = {
    type: "transistor-open",
    drain: false,
    source: false,
    base: false,
    orientation: "down",
    id: { row: 9, column: 4 },
    controlledBy: {
        base: [],
        source: []
    }
}

map[11][4] = {
    type: 'output',
    id: { row: 11, column: 4 },
    isActive: false,
    controlledBy: {
        connection: [],
    }
}