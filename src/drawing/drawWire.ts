import type { Line, Wire } from "../types/Wire"

export const drawWireSegment = (
    ctx: CanvasRenderingContext2D, 
    lines: Line[], 
    isTemporary: boolean = false
) => {
    if (!lines || lines.length === 0) return
    
    // Настройки стиля в зависимости от типа линии
    if (isTemporary) {
        ctx.strokeStyle = '#ff0000' // Красный для временных линий
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.setLineDash([5, 5]) // Пунктир для временных линий
    } else {
        ctx.strokeStyle = '#414141' // Синий для постоянных линий
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.setLineDash([]) // Сплошная линия
    }
    
    // Рисуем все линии сегмента
    for (const line of lines) {
        ctx.beginPath()
        ctx.moveTo(line.xStart, line.yStart)
        ctx.lineTo(line.xEnd, line.yEnd)
        ctx.stroke()
    }
    
    // Сбрасываем пунктирный стиль
    ctx.setLineDash([])
}

export const drawAllWires = (wires: Wire[], ctx: CanvasRenderingContext2D) => {
    wires.forEach(wire => {
        drawWireSegment(ctx, wire.lines)
    })
}