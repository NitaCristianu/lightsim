import { RoomClass } from "./roommain";
import { distSquare, reflect, refract } from "./utility";

export class Light {

    initialDirection = { x: 100, y: 0 }
    initialPosition = { x: 0, y: 0 }
    color = "#66ffbf";
    inside = false;
    angle = 0.5;
    selected = false;

    constructor(initialPosition: { x: number, y: number }, initialDirection: { x: number, y: number }) {
        this.initialDirection = initialDirection;
        this.initialPosition = initialPosition;
    }

    update(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color + "aa";
        ctx.arc(this.initialPosition.x, this.initialPosition.y, 16, 0, 2 * Math.PI);
        ctx.fill();
        ctx.shadowBlur = 0;

        if (this.selected) {
            ctx.beginPath();
            ctx.strokeStyle = "#ffffffaa";
            ctx.lineWidth = 2;
            ctx.arc(this.initialPosition.x, this.initialPosition.y, 16, 0, 2 * Math.PI);
            ctx.stroke();
        }

    }

    on({ x, y }: { x: number, y: number }) {
        return distSquare({ x, y }, this.initialPosition) < 256;

    }

    recordClick(btn: 0 | 1 | 2, mpos: { x: number, y: number }) {

        if (btn == 0 && this.on(mpos)) {
            this.selected = true;
        } else if (btn == 2) {
            this.selected = false;
        }
    }

    drawLine(ctx: CanvasRenderingContext2D, room: RoomClass, position = this.initialPosition, direction = this.initialDirection, limit = 10, inside = this.inside) {
        if (limit <= 0) return;
        ctx.beginPath();
        ctx.shadowBlur = 20;
        ctx.strokeStyle = this.color + Math.floor((limit / 10) * 255).toString(16);
        ctx.shadowColor = ctx.strokeStyle;
        ctx.lineWidth = 3;
        ctx.moveTo(position.x, position.y);

        const intersection = room.raycast(position as any, direction as any) as any;
        if (intersection) {
            // hit;
            var end = intersection.position;
            var normal = intersection.normal;
            var mat = intersection.mat;
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
            if (mat == 0 || mat == 2) {
                var reflection = reflect(direction, normal);
                if (inside) {
                    reflection = {
                        x: -reflection.x,
                        y: -reflection.y
                    }
                }
                this.drawLine(ctx, room, end, reflection, limit - 1, inside);
            }
            if (mat == 1 || mat == 2) {
                var refraction = refract(direction, normal, intersection.refractionIndex);
                if (inside) {
                    refraction = {
                        x: -refraction.x,
                        y: -refraction.y
                    }
                }
                if (refraction) {
                    this.drawLine(ctx, room, end, refraction, limit - 1, !inside)
                }
            }
            if (mat == 3) {
                return;
            }
            return
        } else {
            // didn't hit
            ctx.lineTo(position.x + direction.x * 1000, position.y + direction.y * 1000);
            ctx.stroke();
            ctx.shadowBlur = 0;
            return;
        }
    }
}