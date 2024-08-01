import { lights, rects } from "./elements";
import { Rect } from "./rect";
import { distSquare } from "./utility";

const PADDING = 50;
const ROUNDNESS = 16;

export class RoomClass {

    name;

    // rect placement
    placingRect = false;
    placingrectx = 0;
    placingrecty = 0;

    mpos = { x: 0, y: 0 }

    constructor(name: string) {
        this.name = name;
    }

    update(ctx: CanvasRenderingContext2D, deltaTime: number) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.beginPath();
        ctx.fillStyle = "rgb(14,14,14)";
        ctx.rect(0, 0, window.innerWidth, window.innerHeight);
        ctx.fill();

        ctx.beginPath();
        ctx.roundRect(
            PADDING,
            PADDING,
            window.innerWidth - PADDING * 2,
            window.innerHeight - PADDING * 2,
            ROUNDNESS
        );
        ctx.fillStyle = "rgb(50, 50, 50)";
        ctx.strokeStyle = "rgb(200,200,200)";
        ctx.lineWidth = 1.5;


        ctx.fill();
        ctx.stroke();

        rects.forEach(rect => {
            rect.draw(ctx, deltaTime);
        })

        lights.forEach(light => {
            for (let angle = -Math.PI; angle <= Math.PI; angle += Math.PI / 4) {
                const x = Math.cos(angle) * light.angle;
                const y = Math.sin(angle) * light.angle;
                light.drawLine(ctx, this, light.initialPosition, { x: x + light.initialDirection.x, y: y + light.initialDirection.y });
            }
            light.update(ctx);
        })

        if (this.placingRect) {
            ctx.beginPath();
            ctx.fillStyle = "rgba(0,0,0,.2)";
            ctx.strokeStyle = "rgba(255,255,255,0.8)";
            ctx.setLineDash([10, 10]);
            const x = Math.min(this.placingrectx, this.mpos.x);
            const y = Math.min(this.placingrecty, this.mpos.y);
            const w = Math.abs(this.placingrectx - this.mpos.x);
            const h = Math.abs(this.placingrecty - this.mpos.y);
            ctx.rect(x, y, w, h);
            ctx.fill();
            ctx.stroke();
            ctx.setLineDash([0, 0]);
            ctx.beginPath();
            ctx.fillStyle = "black";
            ctx.strokeStyle = "rgba(255,255,255, 0.8)";
            ctx.arc(this.placingrectx, this.placingrecty, 8, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
        }

        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, window.innerWidth, PADDING);
        ctx.fillRect(window.innerWidth - PADDING, 0, PADDING, window.innerHeight);
        ctx.fillRect(0, 0, PADDING, window.innerHeight);
        ctx.fillRect(0, window.innerHeight - PADDING, window.innerWidth, PADDING);

    }

    onBorder(x = this.mpos.x, y = this.mpos.y) {
        if (x < PADDING) return false;
        if (y < PADDING) return false;
        if (x + PADDING > window.innerWidth) return false;
        if (y + PADDING > window.innerHeight) return false;
    }

    isOnGrid(x = this.mpos.x, y = this.mpos.y) {
        if (this.onBorder(x, y)) return false;

        for (let i = 0; i < lights.length; i++) {
            const light = lights[i];
            if (light.on({ x, y })) {
                return false;
            }
        }
        for (let i = 0; i < rects.length; i++) {
            const rect = rects[i];
            if (rect.inRect(x, y)) {
                return false;
            }
        }
        return true;
    }

    overlapsRects(x: number, y: number, w: number, h: number) {
        for (let i = 0; i < rects.length; i++) {
            const rect = rects[i];
            if (rect.overlapRect(x, y, w, h)) {
                return true;
            }
        }
        return false;

    }

    raycast(position: { x: number, y: number }, direction: { x: number, y: number }) {
        var closestDist = Infinity;
        var closestIntersection: { position: { x: number, y: number }, normal: { x: number, y: number } } | null = null;
        rects.forEach(rect => {
            const intersection = rect.getIntersection(position, direction);
            if (intersection) {
                const dist = distSquare(position, intersection.position);
                if (dist < closestDist) {
                    closestDist = dist;
                    closestIntersection = intersection;
                }
            }
        })
        return closestIntersection;
    }

    recordClick(btn: 0 | 1 | 2, mpos: { x: number, y: number }) {
        const isOnGrid = this.isOnGrid();

        lights.forEach(light => light.recordClick(btn, mpos));

        if (btn == 0 && isOnGrid) {
            var { x, y } = mpos;
            const tlx = Math.min(this.placingrectx, x);
            const tly = Math.min(this.placingrecty, y);
            const w = Math.abs(this.placingrectx - x);
            const h = Math.abs(this.placingrecty - y);
            const overlaps = this.overlapsRects(
                tlx, tly, w, h
            );
            if (!this.placingRect) {
                this.placingRect = true;
                this.placingrectx = mpos.x;
                this.placingrecty = mpos.y;

            } else if (!overlaps) {
                this.placingRect = false;

                rects.push(new Rect(
                    tlx, tly, w, h
                ))

            }

        } else if (btn == 2) {
            this.placingRect = false;
        }
    }


}