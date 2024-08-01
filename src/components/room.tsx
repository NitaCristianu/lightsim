import { useEffect, useRef, useState } from "react"
import { RoomClass } from "../utils/roommain";
import useAnimationFrame from "../hooks/useFrame";
import { lights, rects } from "../utils/elements";
import { useAtom } from "jotai";
import { mode_atom, mode_hold_atom } from "../utils/vars";

export default function Room({ name }: { name: string }) {

    const ref = useRef<HTMLCanvasElement>(null);
    const [room] = useState(new RoomClass(name));
    const [mode_hold] = useAtom(mode_hold_atom);
    const [mode] = useAtom(mode_atom);

    const update = (deltaTime: number) => {
        // every frame
        const canv = ref.current;
        if (!canv) return;
        canv.width = window.innerWidth;
        canv.height = window.innerHeight;
        const ctx = canv.getContext('2d');
        if (!ctx) return;
        room.update(ctx, deltaTime);
    }
    useAnimationFrame(update);

    useEffect(() => {
        room.mode_hold = mode_hold;
    }, [mode_hold])

    useEffect(() => {
        const mouseUp = (event: MouseEvent) => {
            if (event.button == 2)
                room.right = false
            if (event.button == 0)
                room.left = false
        };
        const mouseDown = (event: MouseEvent) => {
            room.recordClick(event.button as any, { x: event.clientX, y: event.clientY }, mode);
            if (event.button == 2)
                room.right = true
            if (event.button == 0)
                room.left = true
        }
        const mouseMove = (event: MouseEvent) => {
            room.mpos = { x: event.clientX, y: event.clientY };
            room.recordMovement({ x: event.clientX, y: event.clientY });
        }
        window.addEventListener("mouseup", mouseUp);
        window.addEventListener("mousedown", mouseDown)
        window.addEventListener("resize", () => {
            if (ref.current) {
                ref.current.width = window.innerWidth;
                ref.current.height = window.innerHeight;
                const ctx = ref.current.getContext("2d");
                if (ctx)
                    room.update(ctx, 0);

            }
        });
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key == "Backspace") {
                rects.forEach(rect => rect.recordBackspace())
                lights.forEach(light => light.recordBackspace());
            }
        }
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("mousemove", mouseMove);
        return () => {
            window.removeEventListener("mouseup", mouseUp);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("mousedown", mouseDown);
            window.removeEventListener("mousemove", mouseMove);
        }
    }, [room, mode])

    return <canvas
        ref={ref}
        style={{
            width: window.innerWidth,
            height: window.innerHeight,
            overflow: 'unset',
            position: 'fixed'

        }}
        onContextMenu={(ev) => ev.preventDefault()}
    />
}