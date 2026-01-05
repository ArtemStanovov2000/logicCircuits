// logic/updateCircuit.ts
import type { MapCell, Transistor, Contact, controlledPointId } from "../types/MapCell"

// Вспомогательная функция для получения состояния элемента по его ID
function getElementState(id: controlledPointId, map: MapCell[][]): boolean {
    const cell = map[id.column]?.[id.row];
    
    if (!cell) return false;
    
    switch (id.type) {
        case 'drain':
            // Проверяем, что это транзистор
            if (cell.type === 'transistor-close' || cell.type === 'transistor-open') {
                return cell.drain;
            }
            break;
            
        case 'contact':
            // Проверяем, что это контакт
            if (cell.type === 'contact') {
                return cell.isActive;
            }
            break;
            
        case 'output':
            // Проверяем, что это выход
            if (cell.type === 'output') {
                return cell.isActive;
            }
            break;
    }
    
    return false;
}

// Функция для обновления состояний всех элементов цепи
export function updateCircuitStates(map: MapCell[][]): void {
    // Сначала обновляем состояния транзисторов
    for (let col = 0; col < map.length; col++) {
        for (let row = 0; row < map[col].length; row++) {
            const cell = map[col][row];
            
            if (!cell) continue;
            
            // Если это транзистор, обновляем его состояние
            if (cell.type === 'transistor-close' || cell.type === 'transistor-open') {
                const transistor = cell as Transistor;
                
                // Вычисляем состояние source (логическое ИЛИ всех подключений к source)
                let sourceState = false;
                if (transistor.controlledBy.source.length > 0) {
                    sourceState = transistor.controlledBy.source.some(
                        id => getElementState(id, map)
                    );
                }
                
                // Вычисляем состояние base (логическое ИЛИ всех подключений к base)
                let baseState = false;
                if (transistor.controlledBy.base.length > 0) {
                    baseState = transistor.controlledBy.base.some(
                        id => getElementState(id, map)
                    );
                }
                
                // Обновляем состояния транзистора
                transistor.source = sourceState;
                transistor.base = baseState;
                
                // В зависимости от типа транзистора вычисляем drain
                if (transistor.type === 'transistor-close') {
                    // Закрытый транзистор: drain = source AND base
                    transistor.drain = sourceState && baseState;
                } else if (transistor.type === 'transistor-open') {
                    // Открытый транзистор: drain = source AND NOT base
                    transistor.drain = sourceState && !baseState;
                }
            }
        }
    }
    
    // Затем обновляем состояния контактов и выходов на основе новых состояний транзисторов
    for (let col = 0; col < map.length; col++) {
        for (let row = 0; row < map[col].length; row++) {
            const cell = map[col][row];
            
            if (!cell) continue;
            
            // Если это контакт или выход, обновляем его состояние
            if (cell.type === 'contact' || cell.type === 'output') {
                const contact = cell as Contact;
                
                // Вычисляем состояние контакта (логическое ИЛИ всех подключений)
                let connectionState = false;
                if (contact.controlledBy.connection.length > 0) {
                    connectionState = contact.controlledBy.connection.some(
                        id => getElementState(id, map)
                    );
                }
                
                // Обновляем состояние контакта
                // Если есть подключения, используем вычисленное состояние
                // Если нет подключений, оставляем текущее состояние (для ручного управления)
                if (contact.controlledBy.connection.length > 0) {
                    contact.isActive = connectionState;
                }
            }
        }
    }
    
    // Может потребоваться несколько итераций, так как транзисторы могут зависеть друг от друга
    // Мы запускаем 2 итерации для стабилизации состояний (обычно достаточно)
    let hasChanges = true;
    let iteration = 0;
    const maxIterations = 10;
    
    while (hasChanges && iteration < maxIterations) {
        hasChanges = false;
        iteration++;
        
        // Обновляем транзисторы снова, учитывая новые состояния
        for (let col = 0; col < map.length; col++) {
            for (let row = 0; row < map[col].length; row++) {
                const cell = map[col][row];
                
                if (!cell || (cell.type !== 'transistor-close' && cell.type !== 'transistor-open')) {
                    continue;
                }
                
                const transistor = cell as Transistor;
                
                // Вычисляем новые состояния
                let sourceState = false;
                if (transistor.controlledBy.source.length > 0) {
                    sourceState = transistor.controlledBy.source.some(
                        id => getElementState(id, map)
                    );
                }
                
                let baseState = false;
                if (transistor.controlledBy.base.length > 0) {
                    baseState = transistor.controlledBy.base.some(
                        id => getElementState(id, map)
                    );
                }
                
                let newDrain;
                if (transistor.type === 'transistor-close') {
                    newDrain = sourceState && baseState;
                } else {
                    newDrain = sourceState && !baseState;
                }
                
                // Проверяем, изменилось ли состояние
                if (transistor.source !== sourceState || 
                    transistor.base !== baseState || 
                    transistor.drain !== newDrain) {
                    hasChanges = true;
                    
                    // Обновляем состояния
                    transistor.source = sourceState;
                    transistor.base = baseState;
                    transistor.drain = newDrain;
                }
            }
        }
        
        // Обновляем контакты снова
        for (let col = 0; col < map.length; col++) {
            for (let row = 0; row < map[col].length; row++) {
                const cell = map[col][row];
                
                if (!cell || (cell.type !== 'contact' && cell.type !== 'output')) {
                    continue;
                }
                
                const contact = cell as Contact;
                
                if (contact.controlledBy.connection.length > 0) {
                    const newState = contact.controlledBy.connection.some(
                        id => getElementState(id, map)
                    );
                    
                    if (contact.isActive !== newState) {
                        hasChanges = true;
                        contact.isActive = newState;
                    }
                }
            }
        }
    }
    
    if (iteration >= maxIterations) {
        console.warn('Превышено максимальное количество итераций для стабилизации состояний цепи');
    }
}