import { HEIGHT, WIDTH } from "../consts/mapConfig"
import type { Substrate, ContactsForArray, TemporaryArrayContact, TemporaryArray } from "../types/materials"

export const substrateLayer: Substrate[][] = []
export const sourseArray: ContactsForArray[] = []
export const temporaryArrayContact: TemporaryArrayContact[] = []
export const temporaryArray: TemporaryArray[] = []

for (let i = 0; i < WIDTH; i++) {
    const row: Substrate[] = []
    for (let j = 0; j < HEIGHT; j++) {
        row.push({
            type: "si"
        })
    }
    substrateLayer.push(row)
}

// Заполнение слоя субстрата
for (let i = 0; i < WIDTH; i++) {
    substrateLayer[35][i] = {
        type: "metal",
        dependencies: [],
        value: 0,
    }
}

for (let i = 36; i < HEIGHT; i++) {
    substrateLayer[i][20] = {
        type: "metal",
        dependencies: [],
        value: 0,
    }
}

substrateLayer[35][50] = {
    type: "p_si",
    value: 0,
}

substrateLayer[35][0] = {
    type: "source",
    value: 0,
}

sourseArray.push({
    label: "A1",
    id: {
        row: 35,
        column: 0,
    }
})

substrateLayer[70][0] = {
    type: "source",
    value: 0,
}

sourseArray.push({
    label: "A2",
    id: {
        row: 70,
        column: 0,
    }
})

for (let i = 1; i < 50; i++) {
    substrateLayer[70][i] = {
        type: "metal",
        dependencies: [],
        value: 0,
    }
}