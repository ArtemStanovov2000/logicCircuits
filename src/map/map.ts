import type { Layer } from "../types/materials";

export const layer: Layer = []

export const source: {
    label: string;
    flag: boolean;
    id: {
        row: number;
        column: number;
        layer: number;
    }
}[] = [
        {
            label: "A1",
            flag: false,
            id: {
                row: 20,
                column: 0,
                layer: 0,
            },
        },
        {
            label: "A2",
            flag: false,
            id: {
                row: 50,
                column: 0,
                layer: 0,
            },
        }
    ]

for (let i = 0; i < 20; i++) {
    layer.push({
        type: "metal",
        dependencies: [],
        id: {
            row: 20,
            column: 1 + i,
            layer: 0,
        }
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
        }
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
        }
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
        }
    })
}

