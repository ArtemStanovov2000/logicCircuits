import { NEUTRAL_VALUE } from "../consts/mapConfig";
import { substrateLayer, temporaryArrayContact, sourseArray, temporaryArray, metalLayer } from "../map/map";

// Создаем массив направлений для проверки соседей
const directions = [
    { row: -1, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: 0, col: 1 }
];

export const updatePotentials = () => {
    const temporaryArrayMaterials = [];

    for (let i = 0; i < temporaryArray.length; i++) {
        const currentItem = temporaryArray[i];
        const cell = substrateLayer[currentItem.id.row][currentItem.id.column];

        if (cell.type === "metal") {
            cell.value = currentItem.value;

            // Добавляем зависимости из currentItem в cell если их нет
            if (currentItem.dependencies && currentItem.dependencies.length > 0) {
                if (!cell.dependencies) {
                    cell.dependencies = [];
                }
                currentItem.dependencies.forEach(dep => {
                    if (!cell.dependencies.includes(dep)) {
                        cell.dependencies.push(dep);
                    }
                });
            }
        }

        // Проверяем всех соседей
        for (let j = 0; j < directions.length; j++) {
            const neighborRow = currentItem.id.row + directions[j].row;
            const neighborCol = currentItem.id.column + directions[j].col;

            // Проверяем существование соседа в массиве
            if (substrateLayer[neighborRow] &&
                substrateLayer[neighborRow][neighborCol] &&
                substrateLayer[neighborRow][neighborCol].type === "metal") {

                const neighbor = substrateLayer[neighborRow][neighborCol];

                if ((currentItem.value - neighbor.value) > 1 && currentItem.value > 0) {
                    // Создаем копию зависимостей из текущего элемента
                    const newDependencies = currentItem.dependencies ?
                        [...currentItem.dependencies] :
                        (neighbor.dependencies ? [...neighbor.dependencies] : []);

                    // Добавляем в массив зависимостей если есть
                    if (currentItem.dependencies && currentItem.dependencies.length > 0) {
                        currentItem.dependencies.forEach(dep => {
                            if (!newDependencies.includes(dep)) {
                                newDependencies.push(dep);
                            }
                        });
                    }

                    temporaryArrayMaterials.push({
                        type: neighbor.type,
                        value: currentItem.value - 1,
                        id: {
                            row: neighborRow,
                            column: neighborCol,
                        },
                        dependencies: newDependencies
                    });

                } else if (currentItem.value === NEUTRAL_VALUE && neighbor.value !== NEUTRAL_VALUE) {
                    // Проверяем, есть ли у соседа все зависимости из currentItem
                    if (currentItem.dependencies && currentItem.dependencies.length > 0) {
                        if (!neighbor.dependencies) {
                            // Если у соседа нет зависимостей, все равно добавляем в очередь
                            // для дальнейшего распространения
                            temporaryArrayMaterials.push({
                                type: neighbor.type,
                                value: neighbor.value, // Сохраняем текущее значение
                                id: {
                                    row: neighborRow,
                                    column: neighborCol,
                                },
                                dependencies: [...currentItem.dependencies] // Копируем зависимости из currentItem
                            });
                            continue;
                        }

                        // Проверяем, что у соседа есть все зависимости из currentItem
                        const hasAllDependencies = currentItem.dependencies.every(dep =>
                            neighbor.dependencies.includes(dep)
                        );

                        if (hasAllDependencies) {
                            // Если у соседа есть все зависимости, устанавливаем NEUTRAL_VALUE
                            const newDependencies = [...neighbor.dependencies];

                            temporaryArrayMaterials.push({
                                type: neighbor.type,
                                value: NEUTRAL_VALUE,
                                id: {
                                    row: neighborRow,
                                    column: neighborCol,
                                },
                                dependencies: newDependencies
                            });
                        } else {
                            // Если у соседа не все зависимости, все равно добавляем в очередь
                            // но с текущим значением, чтобы оно могло распространяться
                            const newDependencies = [...neighbor.dependencies];

                            // Добавляем недостающие зависимости
                            currentItem.dependencies.forEach(dep => {
                                if (!newDependencies.includes(dep)) {
                                    newDependencies.push(dep);
                                }
                            });

                            temporaryArrayMaterials.push({
                                type: neighbor.type,
                                value: neighbor.value, // Сохраняем текущее значение
                                id: {
                                    row: neighborRow,
                                    column: neighborCol,
                                },
                                dependencies: newDependencies
                            });
                        }
                    } else {
                        // Если у currentItem нет зависимостей, просто устанавливаем NEUTRAL_VALUE
                        const newDependencies = neighbor.dependencies ? [...neighbor.dependencies] : [];

                        temporaryArrayMaterials.push({
                            type: neighbor.type,
                            value: NEUTRAL_VALUE,
                            id: {
                                row: neighborRow,
                                column: neighborCol,
                            },
                            dependencies: newDependencies
                        });
                    }
                }
            } else if (
                substrateLayer[neighborRow] &&
                substrateLayer[neighborRow][neighborCol] &&
                substrateLayer[neighborRow][neighborCol].type === "metalProvider"
            ) {

            }
        }
    }

    temporaryArray.splice(0, temporaryArray.length);
    temporaryArray.push(...temporaryArrayMaterials);

    console.log(temporaryArray);

    for (let i = temporaryArrayContact.length - 1; i >= 0; i--) {
        const contact = temporaryArrayContact[i];

        // Ищем в массиве источников элемент с таким же label
        const source = sourseArray.find(s => s.label === contact.label);

        if (source) {
            // Присваиваем значение в substrateLayer
            if (substrateLayer[source.id.row][source.id.column].type === "source") {
                substrateLayer[source.id.row][source.id.column].value = contact.value;
            }

            console.log(source.label);

            // Проверяем всех соседей
            for (const dir of directions) {
                const neighborRow = source.id.row + dir.row;
                const neighborCol = source.id.column + dir.col;

                // Проверяем существование соседа в массиве
                if (substrateLayer[neighborRow] &&
                    substrateLayer[neighborRow][neighborCol] &&
                    substrateLayer[neighborRow][neighborCol].type !== "si") {

                    const neighbor = substrateLayer[neighborRow][neighborCol];

                    // Проверяем, нужно ли обновлять значение соседа
                    if (neighbor.value < contact.value) {
                        // Создаем массив зависимостей для нового элемента
                        const newDependencies = neighbor.dependencies ? [...neighbor.dependencies] : [];

                        // Добавляем source.label если его еще нет
                        if (!newDependencies.includes(source.label)) {
                            newDependencies.push(source.label);
                        }

                        temporaryArray.push({
                            type: neighbor.type,
                            dependencies: newDependencies,
                            value: contact.value - 1,
                            id: {
                                row: neighborRow,
                                column: neighborCol,
                            }
                        });
                    } else if (contact.value === NEUTRAL_VALUE && neighbor.value > NEUTRAL_VALUE) {
                        // Проверяем, есть ли у соседа зависимость от этого источника
                        if (!neighbor.dependencies || !neighbor.dependencies.includes(source.label)) {
                            // Если нет зависимости, оставляем текущее значение
                            continue;
                        }

                        // Создаем массив зависимостей (не изменяем существующие)
                        const newDependencies = neighbor.dependencies ? [...neighbor.dependencies] : [];

                        temporaryArray.push({
                            type: neighbor.type,
                            dependencies: newDependencies,
                            value: NEUTRAL_VALUE,
                            id: {
                                row: neighborRow,
                                column: neighborCol,
                            }
                        });
                    }
                }
            }
        }

        temporaryArrayContact.splice(i, 1);
    }
};