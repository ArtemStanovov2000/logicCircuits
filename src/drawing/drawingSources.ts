import { CELL_SIZE } from "../consts/mapConfig";
import type { Source } from "../types/materials";

export const drawingSourses = (
    ctx: CanvasRenderingContext2D,
    sources: Source[]
) => {
    for (let i = 0; i < sources.length; i++) {
        const y = sources[i].id.row * CELL_SIZE;
        const x = sources[i].id.column * CELL_SIZE;

        if (sources[i].value > 0) {
            ctx.fillStyle = "#72ff7e";
        } else {
            ctx.fillStyle = "#00940cff";
        }

        ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
    }
};