import { distSquare, intersectLines } from "./utility";

const PADDING = 50;

export class Rect {

    x;
    y;
    w;
    h;
    mat: 0 | 1 | 2 | 3 = 1;
    refractionIndex = -3.5; // glass

    /*
        mat
        0 - reflect
        1 - refract
        2 - reflect/refract
        3 - stop
    */

    constructor(x: number, y: number, w: number, h: number) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    inRect(x: number, y: number) {
        return (x >= this.x &&
            y >= this.y &&
            x <= this.x + this.w &&
            y <= this.y + this.h);
    }

    getIntersection(
        position: { x: number, y: number },
        direction: { x: number, y: number }
    ): {
        position: { x: number, y: number },
        normal: { x: number, y: number },
        mat: 0 | 1 | 2 | 3,
        refractionIndex: number,
    } | null {
        direction = { x: direction.x * 1000, y: direction.y * 1000 };
        const line0 = {
            position: { x: this.x, y: this.y },
            direction: { x: this.w, y: 0 },
            normal: { x: 0, y: -1 },
        };
        const line1 = {
            position: { x: this.x, y: this.y },
            direction: { x: 0, y: this.h },
            normal: { x: -1, y: 0 },
        };
        const line2 = {
            position: { x: this.x + this.w, y: this.y },
            direction: { x: 0, y: this.h },
            normal: { x: 1, y: 0 },
        };
        const line3 = {
            position: { x: this.x, y: this.y + this.h },
            direction: { x: this.w, y: 0 },
            normal: { x: 0, y: 1 },
        };
        const lines = [line0, line1, line2, line3];
        const intersections = lines.map(line => ({
            position: intersectLines(line, { position, direction }),
            normal: line.normal
        })).filter(intersection => intersection.position != null && distSquare(intersection.position, position) > 20)

        if (intersections.length == 0) return null;
        var closestDist = Infinity;
        var closest = {
            position: { x: 0, y: 0 },
            normal: { x: 0, y: 0 }
        };
        intersections.forEach((intersection: any | { position: { x: number, y: number }, normal: { x: number, y: number } }) => {
            if (intersection == null) return;
            const dist = distSquare(position, intersection.position);
            if (dist < closestDist) {
                closestDist = dist;
                closest = intersection;
            }
        })
        return { ...closest, mat: this.mat, refractionIndex: this.refractionIndex };
    }

    overlapRect(x: number, y: number, w: number, h: number) {
        return !(this.x + this.w <= x ||
            x + w <= this.x ||
            this.y + this.h <= y ||
            y + h <= this.y);
    }

    draw(ctx: CanvasRenderingContext2D, deltaTime: number) {
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.roundRect(this.x, this.y, this.w, this.h, 4)
        ctx.fill();
    }

}