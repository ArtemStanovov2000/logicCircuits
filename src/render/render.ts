import { updatePotentials } from "../logic/potentialSystem";

let count = 0

export const render = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
) => {
    ctx.clearRect(0, 0, width, height)

    count++
    console.time()
    updatePotentials();
    console.timeEnd()
};