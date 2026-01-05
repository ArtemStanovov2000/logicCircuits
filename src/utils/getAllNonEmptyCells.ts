import { map } from "../map/map"
import type { MapCell } from "../types/MapCell"

// Функция для получения всех непустых элементов карты
export const getAllNonEmptyCells = (): {cell: MapCell, col: number, row: number}[] => {
    const nonEmptyCells: {cell: MapCell, col: number, row: number}[] = []
    
    for (let col = 0; col < map.length; col++) {
        for (let row = 0; row < map[col].length; row++) {
            const cell = map[col][row]
            if (cell !== null) {
                nonEmptyCells.push({
                    cell: cell,
                    col,
                    row
                })
            }
        }
    }
    
    return nonEmptyCells
}