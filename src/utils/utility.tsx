interface Vector {
    x: number;
    y: number;
}

interface Line {
    position: Vector;
    direction: Vector;
}

export function intersectLines(line1: Line, line2: Line): Vector | null {
    const { position: p1, direction: d1 } = line1;
    const { position: p2, direction: d2 } = line2;

    // Calculate the determinants
    const det = d1.x * d2.y - d1.y * d2.x;
    if (det === 0) {
        // Lines are parallel
        return null;
    }

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    const t = (dx * d2.y - dy * d2.x) / det;
    const s = (dx * d1.y - dy * d1.x) / det;

    if (t >= 0 && s >= 0 && t <= 1 && s <= 1) {
        // Calculate the intersection point
        const intersectionX = p1.x + t * d1.x;
        const intersectionY = p1.y + t * d1.y;

        return { x: intersectionX, y: intersectionY };
    }
    return null;
}

export function reflect(direction: Vector, normal: Vector): Vector {
    const dot = direction.x * normal.x + direction.y * normal.y;
    const normSq = normal.x ** 2 + normal.y ** 2;
    const scale = 2 * dot / normSq;

    return {
        x: direction.x - scale * normal.x,
        y: direction.y - scale * normal.y
    };
}

export function refract(direction: Vector, normal: Vector, index: number): Vector {
    const cos_theta = Math.min(1.0, (-direction.x * normal.x + -direction.y * normal.y));
    const r_out_perp = {
        x: index * (direction.x + cos_theta * normal.x),
        y: index * (direction.y + cos_theta * normal.y)
    };
    const r_out_pararel = {
        x: -Math.sqrt(Math.abs(1 - distSquare(r_out_perp, { x: 0, y: 0 }))) * normal.x,
        y: -Math.sqrt(Math.abs(1 - distSquare(r_out_perp, { x: 0, y: 0 }))) * normal.y,
    }
    return {
        x : r_out_pararel.x + r_out_perp.x,
        y : r_out_pararel.y + r_out_perp.y
    }
}


export const distSquare = (a: Vector, b: Vector) => (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);