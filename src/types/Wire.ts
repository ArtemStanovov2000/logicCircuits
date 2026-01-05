export type Line = {
    xStart: number
    yStart: number
    xEnd: number
    yEnd: number
}

export type Wire = {
    lines: Line[]
    id: number
    startPoint: 'drain' | 'contact'
    endPoint: 'source' | 'base' | "output"
}