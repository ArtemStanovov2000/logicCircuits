import type { Transistor } from "./transistorsArr"

const config = {
    length: 60,
    width: 20,
    contactSize: 5,
    drainColor: "#ff0000",
    sourceColor: "#00ff00",
    baseColor: "#0000ff",
    colorFalse: "#3f3f3f",
    colorTrue: "#f8cb00"
}

export const drawTransistor = (arr: Transistor[], ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height)

    arr.forEach(transistor => {
        const { xCenter, yCenter, orientation, drain, source, base } = transistor

        ctx.beginPath()

        switch (orientation) {
            case "left":
                ctx.rect(xCenter - config.width / 2, yCenter - config.length / 2, config.width, config.length)
                break
            case "right":
                ctx.rect(xCenter - config.width / 2, yCenter - config.length / 2, config.width, config.length)
                break
            case "up":
                ctx.rect(xCenter - config.length / 2, yCenter - config.width / 2, config.length, config.width)
                break
            case "down":
                ctx.rect(xCenter - config.length / 2, yCenter - config.width / 2, config.length, config.width)
                break
        }

        ctx.strokeStyle = base && source ? config.colorTrue : config.colorFalse
        ctx.fillStyle = base && source ? config.colorTrue : config.colorFalse  // Цвет заливки
        ctx.fill()
        ctx.lineWidth = 2
        ctx.stroke()

        switch (orientation) {
            case "left":
                // Drain контакт (верхний центр)
                ctx.beginPath()
                ctx.arc(xCenter, yCenter - config.length / 2, config.contactSize, 0, Math.PI * 2)
                ctx.fillStyle = drain ? config.drainColor : config.colorFalse
                ctx.fill()

                // Source контакт (нижний центр)
                ctx.beginPath()
                ctx.arc(xCenter, yCenter + config.length / 2, config.contactSize, 0, Math.PI * 2)
                ctx.fillStyle = source ? config.sourceColor : config.colorFalse
                ctx.fill()

                // Base контакт (левый центр)
                ctx.beginPath()
                ctx.arc(xCenter - config.width / 2, yCenter, config.contactSize, 0, Math.PI * 2)
                ctx.fillStyle = base ? config.baseColor : config.colorFalse
                ctx.fill()
                break

            case "right":
                // Drain контакт (нижний центр)
                ctx.beginPath()
                ctx.arc(xCenter, yCenter + config.length / 2, config.contactSize, 0, Math.PI * 2)
                ctx.fillStyle = drain ? config.drainColor : config.colorFalse
                ctx.fill()

                // Source контакт (верхний центр)
                ctx.beginPath()
                ctx.arc(xCenter, yCenter - config.length / 2, config.contactSize, 0, Math.PI * 2)
                ctx.fillStyle = source ? config.sourceColor : config.colorFalse
                ctx.fill()

                // Base контакт (правый центр)
                ctx.beginPath()
                ctx.arc(xCenter + config.width / 2, yCenter, config.contactSize, 0, Math.PI * 2)
                ctx.fillStyle = base ? config.baseColor : config.colorFalse
                ctx.fill()
                break

            case "up":
                // Drain контакт (левый центр)
                ctx.beginPath()
                ctx.arc(xCenter - config.length / 2, yCenter, config.contactSize, 0, Math.PI * 2)
                ctx.fillStyle = drain ? config.drainColor : config.colorFalse
                ctx.fill()

                // Source контакт (правый центр)
                ctx.beginPath()
                ctx.arc(xCenter + config.length / 2, yCenter, config.contactSize, 0, Math.PI * 2)
                ctx.fillStyle = source ? config.sourceColor : config.colorFalse
                ctx.fill()

                // Base контакт (верхний центр)
                ctx.beginPath()
                ctx.arc(xCenter, yCenter - config.width / 2, config.contactSize, 0, Math.PI * 2)
                ctx.fillStyle = base ? config.baseColor : config.colorFalse
                ctx.fill()
                break

            case "down":
                // Drain контакт (правый центр)
                ctx.beginPath()
                ctx.arc(xCenter + config.length / 2, yCenter, config.contactSize, 0, Math.PI * 2)
                ctx.fillStyle = drain ? config.drainColor : config.colorFalse
                ctx.fill()

                // Source контакт (левый центр)
                ctx.beginPath()
                ctx.arc(xCenter - config.length / 2, yCenter, config.contactSize, 0, Math.PI * 2)
                ctx.fillStyle = source ? config.sourceColor : config.colorFalse
                ctx.fill()

                // Base контакт (нижний центр)
                ctx.beginPath()
                ctx.arc(xCenter, yCenter + config.width / 2, config.contactSize, 0, Math.PI * 2)
                ctx.fillStyle = base ? config.baseColor : config.colorFalse
                ctx.fill()
                break
        }
    })
}

