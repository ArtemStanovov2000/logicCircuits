import { layer, arrRAM, routerArray, arrMetalRAM } from "../map/map";
import type { Id } from "../types/materials";

// Создаем массив направлений для проверки соседей
const directions = [
    { row: -1, col: 0, lay: 0 }, // Влево
    { row: 1, col: 0, lay: 0 }, // Вправо
    { row: 0, col: -1, lay: 0 }, // Вперед
    { row: 0, col: 1, lay: 0 }, // Назад
    { row: 0, col: 0, lay: -1 }, // Вниз
    { row: 0, col: 0, lay: 1 }, // Вверх
];

export const updateSourceElement = () => {
    const currentStepArr: { neighbourId: Id, localElementParam: { value: number, sourceLabel: string }[], id: Id }[] = [];

    // Обрабатываем элементы arrMetalRAM
    for (let i = arrMetalRAM.length - 1; i >= 0; i--) {
        const localElement = arrMetalRAM[i];
        const neighbour = localElement.neighbourId;
        const neighbourElement = routerArray.get(`${neighbour.row},${neighbour.column},${neighbour.layer}`);

        if (!neighbourElement) continue;

        const currentElement = layer[neighbourElement.index];

        if (currentElement.type === "metal") {
            // Перебираем все параметры для данного соседа
            for (const param of localElement.localElementParam) {
                const existingDepIndex = currentElement.dependencies.findIndex(dep => dep.sourceLabel === param.sourceLabel);
                if (existingDepIndex !== -1) {
                    // Обновляем существующую зависимость
                    currentElement.dependencies[existingDepIndex].value = param.value;
                } else {
                    // Добавляем новую зависимость
                    currentElement.dependencies.push({
                        value: param.value,
                        sourceLabel: param.sourceLabel
                    });
                }
            }
            arrMetalRAM.splice(i, 1);


            for (let j = 0; j < directions.length; j++) { // Пройдемся по всем направлениям 
                const row = currentElement.id.row + directions[j].row
                const col = currentElement.id.column + directions[j].col
                const lay = currentElement.id.layer + directions[j].lay

                const neighbourElement = routerArray.get(`${row},${col},${lay}`)
                if (neighbourElement) {
                    const nextNeighbour = layer[neighbourElement.index]
                    const neighbourDepList = nextNeighbour.dependencies
                    const depIndex = neighbourDepList.findIndex((element) => element.sourceLabel === localElement.localElementParam[0].sourceLabel)
                    if (localElement.localElementParam[0].value > 0) {
                        if (depIndex === -1 || nextNeighbour.dependencies[depIndex].value < localElement.localElementParam[0].value) {
                            currentStepArr.push({ neighbourId: nextNeighbour.id, localElementParam: [{ value: localElement.localElementParam[0].value - 1, sourceLabel: localElement.localElementParam[0].sourceLabel }], id: currentElement.id })
                        }
                    } else if (localElement.localElementParam[0].value === 0) {
                        if (depIndex === -1 || nextNeighbour.dependencies[depIndex].value !== 0) {
                            currentStepArr.push({ neighbourId: nextNeighbour.id, localElementParam: [{ value: 0, sourceLabel: localElement.localElementParam[0].sourceLabel }], id: currentElement.id })
                        }
                    }
                }
            }
        } else if (currentElement.type === "si") {
            
        }
    }

    console.log(currentStepArr)
    arrMetalRAM.push(...currentStepArr)
    currentStepArr.splice(0, currentStepArr.length);

    for (let i = arrRAM.length - 1; i >= 0; i--) { // Обходим массив источников
        const localElement = arrRAM[i]

        for (let j = 0; j < directions.length; j++) { // Пройдемся по всем направлениям 
            const row = localElement.id.row + directions[j].row
            const col = localElement.id.column + directions[j].col
            const lay = localElement.id.layer + directions[j].lay

            const neighbourElement = routerArray.get(`${row},${col},${lay}`)
            if (neighbourElement) {
                const neighbour = layer[neighbourElement.index]
                if (localElement.value === 0) {
                    arrMetalRAM.push({ neighbourId: neighbour.id, localElementParam: [{ value: 0, sourceLabel: localElement.label }] })
                } else {
                    arrMetalRAM.push({ neighbourId: neighbour.id, localElementParam: [{ value: localElement.value - 1, sourceLabel: localElement.label }] })
                }
            }
        }

        arrRAM.splice(i, 1)
    }
};