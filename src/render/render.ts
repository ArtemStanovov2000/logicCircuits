import { MAX_VALUE, NEUTRAL_VALUE } from "../consts/mapConfig";
import { drawingSubstrateLayer } from "../drawing/substrateLayer";
import { updatePotentials } from "../logic/potentialSystem";
import { metalLayer, substrateLayer, temporaryArrayContact } from "../map/map";

let count = 0

export const render = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    activeLayers: string
) => {
    ctx.clearRect(0, 0, width, height);

    if (activeLayers === "substrate") {
        drawingSubstrateLayer(ctx, substrateLayer);
    }

    if (activeLayers === "base") {
        drawingSubstrateLayer(ctx, metalLayer);
    }

    if (count === 100) {
        temporaryArrayContact.push({ type: "contact", label: "A1", value: MAX_VALUE })
    }

    if (count === 150) {
        temporaryArrayContact.push({ type: "contact", label: "A2", value: MAX_VALUE })
    }

    if (count === 300) {
        temporaryArrayContact.push({ type: "contact", label: "A1", value: NEUTRAL_VALUE })
    }

    if (count === 360) {
        temporaryArrayContact.push({ type: "contact", label: "A2", value: NEUTRAL_VALUE })
    }

    count++
    console.time()
    updatePotentials();
    console.timeEnd()
};