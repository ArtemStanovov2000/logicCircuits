import { HEIGHT, WIDTH } from "../consts/mapConfig"
import type { Substrate, Source, TemporaryArray } from "../types/materials"

export const substrateLayer: Substrate[][] = []
export const sources: Source[] = []
export const temporaryArray: TemporaryArray[] = []

sources.push({
    type: "source",
    value: 0,
    id: {
        row: 35,
        column: 0,
    }
})

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
        value: 0,
    }
}

for (let i = 36; i < HEIGHT; i++) {
    substrateLayer[i][20] = {
        type: "metal",
        value: 0,
    }
}

substrateLayer[35][49] = {
    type: "p_si",
    value: false,
}

substrateLayer[35][50] = {
    type: "p_si",
    value: false,
}

substrateLayer[35][51] = {
    type: "p_si",
    value: false,
}