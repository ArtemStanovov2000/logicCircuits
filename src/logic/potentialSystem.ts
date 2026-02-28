import { layer, arrRAM } from "../map/map";

// Создаем массив направлений для проверки соседей
const directions = [
    { row: -1, col: 0, lay: 0 },
    { row: 1, col: 0, lay: 0 },
    { row: 0, col: -1, lay: 0 },
    { row: 0, col: 1, lay: 0 },
    { row: 0, col: 0, lay: -1 },
    { row: 0, col: 0, lay: 1 },
];

export const updatePotentials = () => {
    for (let i = 0; i < arrRAM.length; i++) {
        for (let j = 0; j < directions.length; j++) {
            const row = arrRAM[i].id.row + directions[j].row
            const col = arrRAM[i].id.column + directions[j].col
            const lay = arrRAM[i].id.layer + directions[j].lay
        }
    }
};