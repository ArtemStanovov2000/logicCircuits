import { drawingSubstrateLayer } from "../drawing/substrateLayer";
import { updateSourceElement } from "../logic/potentialSystem";
import { setSourseState } from "../logic/setSourseState";

let count = 0

export const render = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
) => {
    ctx.clearRect(0, 0, width, height)

    drawingSubstrateLayer(ctx)

    if (count === 100) {
        setSourseState([{ label: "A1", value: 200 }])
    }

    if (count === 120) {
        setSourseState([{ label: "A2", value: 200 }, { label: "A1", value: 0 }])
    }

    if (count === 200) {
        setSourseState([{ label: "A2", value: 0 }])
    }

    updateSourceElement();

    count = count + 1
};