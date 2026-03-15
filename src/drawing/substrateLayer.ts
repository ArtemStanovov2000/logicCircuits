import { CELL_SIZE } from "../consts/mapConfig";
import { source, layer } from "../map/map";
import type { Metal, Si } from "../types/materials";

export const drawingSubstrateLayer = (ctx: CanvasRenderingContext2D) => {
  source.forEach(item => {
    const x = item.id.column * CELL_SIZE;
    const y = item.id.row * CELL_SIZE;

    ctx.fillStyle = item.value > 0 ? '#ff2424' : '#810000';
    ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
  });

  layer.forEach((item: Metal | Si) => {
    const x = item.id.column * CELL_SIZE;
    const y = item.id.row * CELL_SIZE;

    const hasTrueValue = item.dependencies.some(dep => dep.value > 0);
    if (item.type === "metal") {
      ctx.fillStyle = hasTrueValue ? '#fffb23' : '#817f01';
    } else if (item.type === "si") {
      ctx.fillStyle = hasTrueValue ? '#23ff35' : '#008d0c';
    }
    ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
  });
};