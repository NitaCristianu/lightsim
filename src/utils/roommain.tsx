import { lights, rects } from "./elements";
import { Light } from "./light";
import { Rect } from "./rect";
import { distSquare } from "./utility";
import { onProps } from "./vars";

const PADDING = 50;
const ROUNDNESS = 16;

export class RoomClass {

    name;

    // rect placement
    left = false;
    right = false;;
    placingRect = false;
    placingrectx = 0;
    placingrecty = 0;
    mode_hold = false;

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
        ctx.strokeStyle = "rgb(200,200,200)";
        ctx.lineWidth = 1.5;


        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "rgb(62, 62, 62)";

        for (let i = 0; i < window.innerWidth; i += 50) {
            for (let j = 0; j < window.innerHeight; j += 50) {
                ctx.beginPath();
                ctx.fillStyle = "rgba(255,255,255,0.4)";
                ctx.arc(i, j, 2, 0, 2 * Math.PI);
                ctx.fill()
            }

        }

        lights.forEach(light => {
            ctx.beginPath();
            ctx.shadowBlur = 280;
            ctx.shadowColor = light.color;
            ctx.fillStyle = light.color;
            ctx.arc(light.initialPosition.x, light.initialPosition.y, 16, 0, 2 * Math.PI);
            ctx.fill();
        })

        rects.forEach(rect => {
            rect.draw(ctx, deltaTime);
        })

        lights.forEach(light => {
            for (let angle = -light.angle + light.rotation; angle <= light.angle + light.rotation; angle += Math.PI / light.rays) {

                const x = Math.cos(angle) * 100;
                const y = Math.sin(angle) * 100;
                light.drawLine(ctx, this, light.initialPosition, { x, y });
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
        if (this.mode_hold) return false;

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

    recordMovement(mpos: { x: number, y: number }) {
        lights.forEach(light => light.recordMovement(this, mpos));
        rects.forEach(rect => rect.recordMovement(this, mpos));

    }

    recordClick(btn: 0 | 1 | 2, mpos: { x: number, y: number }, mode: boolean) {
        if (onProps) return;
        const isOnGrid = this.isOnGrid();

        lights.forEach(light => light.recordClick(btn, mpos));
        rects.forEach(rect => rect.recordClick(btn, this))


        if (btn == 0 && isOnGrid) {
            if (mode == true) {

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

            }
            if (mode == false) {
                lights.push(new Light(this.mpos, { x: 1, y: 0 }));
            }
        }
        if (btn == 2) {
            this.placingRect = false;
        }
    }


}