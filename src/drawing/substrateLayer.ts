import { CELL_SIZE } from "../consts/mapConfig";
import type { Substrate } from "../types/materials";

export const drawingSubstrateLayer = (
  ctx: CanvasRenderingContext2D,
  layer: Substrate[][]
) => {
  for (let row = 0; row < layer.length; row++) {
    for (let col = 0; col < layer[row].length; col++) {
      const cell = layer[row][col];
      const x = col * CELL_SIZE;
      const y = row * CELL_SIZE;

      switch (cell.type) {
        case "si":
          ctx.fillStyle = "#3f3f3f";
          break;

        case "metal":
          if (cell.value > 0) {
            ctx.fillStyle = "#ffe344";
          } else {
            ctx.fillStyle = "#9b4600";
          }
          break;

        case "p_si":
          if (cell.value) {
            ctx.fillStyle = "#2c2cff";
          } else {
            ctx.fillStyle = "#000080";
          }
          break;

        default:
          ctx.fillStyle = "#CCCCCC";
          break;
      }

      ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
    }
  }
};