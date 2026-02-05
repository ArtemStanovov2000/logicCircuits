import { drawingSubstrateLayer } from "../drawing/substrateLayer";
import { updatePotentials } from "../logic/potentialSystem";
import { setSourseState } from "../logic/setSourseState";

let count = 0

export const render = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
) => {
    ctx.clearRect(0, 0, width, height)

    drawingSubstrateLayer(ctx)

    if (count === 50) {
        setSourseState([{label: "A1", value: true}])
    }

    if (count === 60) {
        setSourseState([{label: "A2", value: true}, {label: "A1", value: false}])
    }

    if (count === 100) {
        setSourseState([{label: "A2", value: false}])
    }

    updatePotentials();

    count++
};