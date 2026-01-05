import type { Transistor, Contact } from "../types/MapCell";
import { CELL_SIZE } from "../consts/mapConfig";
import { transistorConfig } from "../consts/transistorConfig";
import { contactConfig } from "../consts/contactConfig";

export interface ContactInfo {
    type: 'transistor' | 'contact' | 'output';
    contactType?: 'drain' | 'source' | 'base'; // Только для транзистора
    contactPosition: { x: number, y: number };
    elementPosition: { column: number, row: number };
    isActive: boolean;
    data: Transistor | Contact;
}

// Получение координат контактов транзистора
export const getTransistorContactCoords = (
    transistor: Transistor,
    cellX: number,
    cellY: number
) => {
    const centerX = cellX * CELL_SIZE + CELL_SIZE / 2;
    const centerY = cellY * CELL_SIZE + CELL_SIZE / 2;
    const { length, width } = transistorConfig;

    const contacts: Record<'drain' | 'source' | 'base', { x: number, y: number }> = {
        drain: { x: 0, y: 0 },
        source: { x: 0, y: 0 },
        base: { x: 0, y: 0 }
    };

    switch (transistor.orientation) {
        case "left":
            contacts.drain = { x: centerX, y: centerY - length / 2 };
            contacts.source = { x: centerX, y: centerY + length / 2 };
            contacts.base = { x: centerX - width / 2, y: centerY };
            break;
        case "right":
            contacts.drain = { x: centerX, y: centerY + length / 2 };
            contacts.source = { x: centerX, y: centerY - length / 2 };
            contacts.base = { x: centerX + width / 2, y: centerY };
            break;
        case "up":
            contacts.drain = { x: centerX - length / 2, y: centerY };
            contacts.source = { x: centerX + length / 2, y: centerY };
            contacts.base = { x: centerX, y: centerY - width / 2 };
            break;
        case "down":
            contacts.drain = { x: centerX + length / 2, y: centerY };
            contacts.source = { x: centerX - length / 2, y: centerY };
            contacts.base = { x: centerX, y: centerY + width / 2 };
            break;
    }

    return contacts;
};

// Основная функция для определения контакта под курсором
export const getContactAtPosition = (
    mouseX: number,
    mouseY: number,
    cell: Transistor | Contact | null,
    cellX: number, // Индекс колонки
    cellY: number  // Индекс строки
): ContactInfo | null => {
    if (!cell) return null;

    // Случай 1: Транзистор
    if (cell.type === 'transistor-close' || cell.type === 'transistor-open') {
        const transistor = cell as Transistor;
        const contacts = getTransistorContactCoords(transistor, cellX, cellY);

        // Проверяем каждый контакт транзистора
        for (const [type, coords] of Object.entries(contacts) as [
            'drain' | 'source' | 'base',
            { x: number; y: number }
        ][]) {
            const distance = Math.sqrt(
                Math.pow(mouseX - coords.x, 2) +
                Math.pow(mouseY - coords.y, 2)
            );

            if (distance <= transistorConfig.contactSize) {
                return {
                    type: 'transistor',
                    contactType: type,
                    contactPosition: coords,
                    elementPosition: { column: cellX, row: cellY },
                    isActive: transistor[type], // drain/source/base значение
                    data: transistor
                };
            }
        }
        return null; // Курсор не над контактом транзистора
    }

    // Случай 2 и 3: Контакты (contact или drain)
    if (cell.type === 'contact' || cell.type === 'output') {
        const contact = cell as Contact;

        // Центр ячейки (где рисуется кружок)
        const centerX = cellX * CELL_SIZE + CELL_SIZE / 2;
        const centerY = cellY * CELL_SIZE + CELL_SIZE / 2;

        // Проверяем расстояние до центра
        const distance = Math.sqrt(
            Math.pow(mouseX - centerX, 2) +
            Math.pow(mouseY - centerY, 2)
        );

        if (distance <= contactConfig.size) {
            return {
                type: cell.type,
                contactPosition: { x: centerX, y: centerY },
                elementPosition: { column: cellX, row: cellY },
                isActive: contact.isActive,
                data: contact
            };
        }
    }

    return null; // Курсор не над контактом
};