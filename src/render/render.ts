import { drawingSubstrateLayer } from "../drawing/substrateLayer";
import { updatePotentials } from "../logic/potentialSystem";

export const render = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
) => {
    ctx.clearRect(0, 0, width, height)

    drawingSubstrateLayer(ctx)

    updatePotentials();
};