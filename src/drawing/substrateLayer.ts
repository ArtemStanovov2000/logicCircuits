import { CELL_SIZE } from "../consts/mapConfig";
import { source, layer } from "../map/map";
import type { Metal } from "../types/materials";

export const drawingSubstrateLayer = (ctx: CanvasRenderingContext2D) => {
  source.forEach(item => {
    const x = item.id.column * CELL_SIZE;
    const y = item.id.row * CELL_SIZE;

    ctx.fillStyle = item.flag ? '#ff2424' : '#810000';
    ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
  });

  layer.forEach((item: Metal) => {
    const x = item.id.column * CELL_SIZE;
    const y = item.id.row * CELL_SIZE;

    const hasTrueValue = item.dependencies.some(dep => Boolean(dep.value));
    ctx.fillStyle = hasTrueValue ? '#fffb23' : '#817f01';
    ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
  });
};