import type { Id, Layer } from "../types/materials";

export const layer: Layer = [] // материалы схемы
export const routerArray = new Map() // все элементы схемы, но для быстрого поиска
export const arrRAM: { type: "source", value: number, id: Id, label: string }[] = [] // массив временных элементов для обновления
export const arrMetalRAM: { neighbourId: Id, localElementParam: { value: number, sourceLabel: string }[] }[] = []

export const source: {
    label: string;
    value: number;
    id: Id
}[] = [
        {
            label: "A1",
            value: 0,
            id: {
                row: 20,
                column: 0,
                layer: 0,
            },
        },
        {
            label: "A2",
            value: 0,
            id: {
                row: 50,
                column: 0,
                layer: 0,
            },
        },
        {
            label: "A3",
            value: 0,
            id: {
                row: 35,
                column: 0,
                layer: 0,
            },
        }
    ] // массив источников сигнала

for (let i = 0; i < 20; i++) {
    layer.push({
        type: "metal",
        dependencies: [],
        id: {
            row: 20,
            column: 1 + i,
            layer: 0,
        },
    })

    routerArray.set(`${20},${1 + i},${0}`,
        {
            index: routerArray.size,
            id: {
                row: 20,
                column: 1 + i,
                layer: 0,
            },
        })
}

for (let i = 0; i < 20; i++) {
    layer.push({
        type: "metal",
        dependencies: [],
        id: {
            row: 50,
            column: 1 + i,
            layer: 0,
        },
    })

    routerArray.set(`${50},${1 + i},${0}`,
        {
            index: routerArray.size,
            id: {
                row: 50,
                column: 1 + i,
                layer: 0,
            },
        })
}

for (let i = 0; i < 50; i++) {
    layer.push({
        type: "metal",
        dependencies: [],
        id: {
            row: 10 + i,
            column: 21,
            layer: 0,
        },
    })

    routerArray.set(`${10 + i},${21},${0}`,
        {
            index: routerArray.size,
            id: {
                row: 10 + i,
                column: 21,
                layer: 0,
            },
        })
}

for (let i = 0; i < 20; i++) {
    layer.push({
        type: "metal",
        dependencies: [],
        id: {
            row: 35,
            column: 22 + i,
            layer: 0,
        },
    })

    routerArray.set(`${35},${22 + i},${0}`,
        {
            index: routerArray.size,
            id: {
                row: 35,
                column: 22 + i,
                layer: 0,
            },
        })
}


for (let i = 0; i < 10; i++) {
    layer.push({
        type: "metal",
        dependencies: [],
        id: {
            row: 35,
            column: 1 + i,
            layer: 0,
        },
    })


    routerArray.set(`${35},${1 + i},${0}`,
        {
            index: routerArray.size,
            id: {
                row: 35,
                column: 1 + i,
                layer: 0,
            },
        })
}

for (let i = 0; i < 2; i++) {
    layer.push({
        type: "metal",
        dependencies: [],
        id: {
            row: 35,
            column: 9,
            layer: 1 + i,
        },
    })

    routerArray.set(`${35},${9},${1 + i}`,
        {
            index: routerArray.size,
            id: {
                row: 35,
                column: 9,
                layer: 1 + i,
            },
        })
}

for (let i = 0; i < 7; i++) {
    layer.push({
        type: "metal",
        dependencies: [],
        id: {
            row: 35,
            column: 10 + i,
            layer: 2,
        },
    })


    routerArray.set(`${35},${10 + i},${2}`,
        {
            index: routerArray.size,
            id: {
                row: 35,
                column: 10 + i,
                layer: 2,
            },
        })
}

