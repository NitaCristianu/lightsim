import { v4 } from "uuid";
import { RoomClass } from "./roommain";
import { distSquare, reflect, refract } from "./utility";
import { onProps } from "./vars";
import { lights } from "./elements";

export class Light {

    initialPosition = { x: 0, y: 0 }
    color = "#ffffff";
    inside = false;
    angle = 0.5;
    rotation = Math.PI/2;
    rays = 10;
    id;
    selected = false;

    lastmpos = { x: 0, y: 0 }

    constructor(initialPosition: { x: number, y: number }, initialDirection: { x: number, y: number }) {
        this.id = v4();
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

    recordMovement(room: RoomClass, mpos: { x: number, y: number }) {
        if (this.selected && room.left && !room.placingRect && !onProps) {
            var delta;
            if (distSquare(this.lastmpos, { x: 0, y: 0 }) == 0) delta = { x: 0, y: 0 };
            else delta = { x: mpos.x - this.lastmpos.x, y: mpos.y - this.lastmpos.y };
            this.initialPosition = {
                x: this.initialPosition.x + delta.x,
                y: this.initialPosition.y + delta.y,
            }
            if (room.overlapsRects(this.initialPosition.x - 8, this.initialPosition.y - 8, 16, 16)) {
                this.inside = true;
            } else {
                this.inside = false;
            }
        }
        this.lastmpos = mpos;
    }

    recordClick(btn: 0 | 1 | 2, mpos: { x: number, y: number }) {

        if (btn == 0 && this.on(mpos)) {
            lights.forEach(light => light.selected = false);
            this.selected = true;
        } else if (btn == 2) {
            this.selected = false;
        }
    }

    recordBackspace() {
        if (this.selected) {
            const index = lights.findIndex(light => light.id == this.id);
            lights.splice(index, 1);
        }
    }

    drawLine(ctx: CanvasRenderingContext2D, room: RoomClass, position = this.initialPosition, direction = { x: 1, y: 0 }, limit = 10, inside = this.inside) {
        if (limit <= 0) return;
        ctx.beginPath();
        ctx.shadowBlur = 20;
        ctx.strokeStyle = this.color + Math.floor((limit / 10) * 255).toString(16);
        ctx.shadowColor = ctx.strokeStyle + "aa";
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
                    reflection = reflect(direction, { x: -normal.x, y: -normal.y })
                }
                this.drawLine(ctx, room, end, reflection, limit - 1, inside);
            }
            if (mat == 1 || mat == 2) {
                var refraction = refract(direction, normal, intersection.refractionIndex);
                if (inside) {
                    refraction = refract(direction, { x: -normal.x, y: -normal.y }, intersection.refractionIndex);
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