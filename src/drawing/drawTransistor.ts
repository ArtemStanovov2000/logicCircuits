import type { Transistor } from "../types/MapCell";
import { CELL_SIZE } from "../consts/mapConfig";
import { transistorConfig } from "../consts/transistorConfig";

export const drawTransistor = (
    ctx: CanvasRenderingContext2D,
    transistor: Transistor,
    x: number,
    y: number
) => {
    const centerX = x * CELL_SIZE + CELL_SIZE / 2;
    const centerY = y * CELL_SIZE + CELL_SIZE / 2;

    ctx.fillStyle = transistorConfig.colorFalsyPoint;

    switch (transistor.orientation) {
        case "up":
        case "down":
            ctx.fillRect(
                centerX - transistorConfig.length / 2,
                centerY - transistorConfig.width / 2,
                transistorConfig.length,
                transistorConfig.width
            );
            break;
        case "left":
        case "right":
            ctx.fillRect(
                centerX - transistorConfig.width / 2,
                centerY - transistorConfig.length / 2,
                transistorConfig.width,
                transistorConfig.length
            );
            break;
    }

    const drawContact = (contactX: number, contactY: number, isActive: boolean) => {
        ctx.beginPath();
        ctx.arc(contactX, contactY, transistorConfig.contactSize, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? transistorConfig.colorTrue : transistorConfig.colorFalse;
        ctx.fill();
    };

    switch (transistor.orientation) {
        case "left":
            drawContact(centerX, centerY - transistorConfig.length / 2, transistor.drain); 
            drawContact(centerX, centerY + transistorConfig.length / 2, transistor.source); 
            drawContact(centerX - transistorConfig.width / 2, centerY, transistor.base); 
            break;

        case "right":
            drawContact(centerX, centerY + transistorConfig.length / 2, transistor.drain);
            drawContact(centerX, centerY - transistorConfig.length / 2, transistor.source);
            drawContact(centerX + transistorConfig.width / 2, centerY, transistor.base);
            break;

        case "up":
            drawContact(centerX - transistorConfig.length / 2, centerY, transistor.drain);
            drawContact(centerX + transistorConfig.length / 2, centerY, transistor.source);
            drawContact(centerX, centerY - transistorConfig.width / 2, transistor.base);
            break;

        case "down":
            drawContact(centerX + transistorConfig.length / 2, centerY, transistor.drain); 
            drawContact(centerX - transistorConfig.length / 2, centerY, transistor.source); 
            drawContact(centerX, centerY + transistorConfig.width / 2, transistor.base); 
            break;
    }
};

