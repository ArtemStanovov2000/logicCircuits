import { transistors } from "../components/transistorsArr"
import { drawTransistor } from "../components/drawTransistor"

export const render = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    drawTransistor(transistors, ctx, width, height)
}