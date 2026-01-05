// drawing/drawGrid.ts
import { map } from "../map/map"
import { CELL_SIZE } from "../consts/mapConfig"

export const drawGrid = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
) => {
    // Вычисляем количество ячеек, которые помещаются на экране
    const cellsX = Math.ceil(width / CELL_SIZE)
    const cellsY = Math.ceil(height / CELL_SIZE)

    // Ограничиваем размеры размерами карты
    const clampedCellsX = Math.min(cellsX, map.length)
    const clampedCellsY = Math.min(cellsY, map[0]?.length || 0)

    ctx.strokeStyle = '#ccc'
    ctx.lineWidth = 1

    // Вертикальные линии
    for (let col = 0; col <= clampedCellsX; col++) {
        const canvasX = col * CELL_SIZE
        ctx.beginPath()
        ctx.moveTo(canvasX, 0)
        ctx.lineTo(canvasX, clampedCellsY * CELL_SIZE)
        ctx.stroke()
    }

    // Горизонтальные линии
    for (let row = 0; row <= clampedCellsY; row++) {
        const canvasY = row * CELL_SIZE
        ctx.beginPath()
        ctx.moveTo(0, canvasY)
        ctx.lineTo(clampedCellsX * CELL_SIZE, canvasY)
        ctx.stroke()
    }
}