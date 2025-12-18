export type Transistor = {
    drain: boolean
    source: boolean
    base: boolean
    id: number,
    xCenter: number,
    yCenter: number,
    orientation: "up" | "down" | "left" | "right"
}

export const transistors: Transistor[] = [
    {
        drain: true,
        source: true,
        base: true,
        id: 1,
        xCenter: 300,
        yCenter: 300,
        orientation: "down",
    }
]