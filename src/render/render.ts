import { MAX_VALUE, MIN_VALUE } from "../consts/mapConfig";
import { drawingSourses } from "../drawing/drawingSources";
import { drawingSubstrateLayer } from "../drawing/substrateLayer";
import { updatePotentials } from "../logic/potentialSystem";
import { sources, substrateLayer, temporaryArray } from "../map/map";

export const render = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    activeLayers: string
) => {
    ctx.clearRect(0, 0, width, height);

    if (activeLayers === "substrate") {
        drawingSubstrateLayer(ctx, substrateLayer);
        drawingSourses(ctx, sources)
    }

    if (Math.random() > 0.98) {
        temporaryArray.push({
            type: "source",
            value: MAX_VALUE,
            id: {
                row: 35,
                column: 0,
            }
        })
    }

    console.log(substrateLayer[35][0])
    updatePotentials();
};