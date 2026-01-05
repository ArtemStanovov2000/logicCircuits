// render.ts
import { drawGrid } from "../drawing/drawGrid"
import { drawTransistor } from "../drawing/drawTransistor"
import { map } from "../map/map"
import { CELL_SIZE } from "../consts/mapConfig"
import type { MapCell } from "../types/MapCell"
import { drawContact } from "../drawing/drawContact"
import { drawAllWires, drawWireSegment } from "../drawing/drawWire"
import { wires } from "../map/line"
import type { Line } from "../types/Wire"
import { updateCircuitStates } from "../logic/updateCircuit"

export const render = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    existingLines: Line[] = [],
    tempLines: Line[] | null = null
) => {
    // Очищаем canvas
    ctx.clearRect(0, 0, width, height)

    // ПЕРЕСЧИТЫВАЕМ СОСТОЯНИЯ ПЕРЕД ОТРИСОВКОЙ
    updateCircuitStates(map)

    // Вычисляем количество видимых ячеек
    const cellsX = Math.ceil(width / CELL_SIZE)
    const cellsY = Math.ceil(height / CELL_SIZE)

    // Ограничиваем размеры картой
    const clampedCellsX = Math.min(cellsX, map.length)
    const clampedCellsY = Math.min(cellsY, map[0]?.length || 0)

    // Рисуем сетку
    drawGrid(ctx, width, height)

    // Отрисовываем элементы карты в видимой области
    for (let col = 0; col < clampedCellsX; col++) {
        for (let row = 0; row < clampedCellsY; row++) {
            const cell = map[col]?.[row] as MapCell | undefined

            if (!cell) continue

            // Проверяем тип ячейки и отрисовываем соответствующий элемент
            if (cell.type === 'transistor-close' || cell.type === 'transistor-open') {
                drawTransistor(ctx, cell, col, row)
            }
            else if (cell.type === 'contact') {
                drawContact(ctx, cell, col, row)
            }
            else if (cell.type === 'output') {
                drawContact(ctx, cell, col, row)
            }
        }
    }

    // Рисуем все провода из массива wires
    drawAllWires(wires, ctx)

    // Рисуем существующие сегменты текущего провода
    if (existingLines && existingLines.length > 0) {
        drawWireSegment(ctx, existingLines, false)
    }

    // Рисуем временные линии для предпросмотра
    if (tempLines && tempLines.length > 0) {
        drawWireSegment(ctx, tempLines, true)
    }
}