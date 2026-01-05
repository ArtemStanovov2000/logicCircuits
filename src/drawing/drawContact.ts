// drawing/drawContact.ts
import type { Contact } from "../types/MapCell"
import { CELL_SIZE } from "../consts/mapConfig"
import { contactConfig } from "../consts/contactConfig"

export const drawContact = (
    ctx: CanvasRenderingContext2D,
    contact: Contact,
    x: number,
    y: number
) => {
    const centerX = x * CELL_SIZE + CELL_SIZE / 2
    const centerY = y * CELL_SIZE + CELL_SIZE / 2

    // Рисуем обводку (контур)
    ctx.beginPath()
    ctx.arc(centerX, centerY, contactConfig.size, 0, Math.PI * 2)
    ctx.fillStyle = contactConfig.outlineColor
    ctx.fill()

    // Рисуем внутреннюю часть
    const innerRadius = contactConfig.size - contactConfig.outlineWidth
    ctx.beginPath()
    ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2)
    ctx.fillStyle = contact.isActive ? contactConfig.colorTrue : contactConfig.colorFalse
    ctx.fill()
}