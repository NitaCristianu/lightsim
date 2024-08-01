import { useEffect, useRef, useState } from "react"
import { RoomClass } from "../utils/roommain";
import useAnimationFrame from "../hooks/useFrame";
import React from "react";

export default function Room({ name }: { name: string }) {

    const ref = useRef<HTMLCanvasElement>(null);
    const [room] = useState(new RoomClass(name));

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
    useAnimationFrame(update)

    useEffect(() => {
        const mouseUp = (event : MouseEvent)=>{
            room.recordClick(0, {x : event.clientX, y : event.clientY});
        };
        const mouseMove = (event : MouseEvent)=>{
            room.mpos = {x : event.clientX, y : event.clientY}
        }
        window.addEventListener("mouseup", mouseUp);
        window.addEventListener("resize", () => {
            if (ref.current) {
                ref.current.width = window.innerWidth;
                ref.current.height = window.innerHeight;
                const ctx = ref.current.getContext("2d");
                if (ctx)
                    room.update(ctx, 0);

            }
        });
        window.addEventListener("mousemove", mouseMove);
        return ()=>{
            window.removeEventListener("mouseup", mouseUp);
            window.removeEventListener("mousemove", mouseMove);
        }
    }, [room])

    return <canvas
        ref={ref}
        style={{
            width: window.innerWidth,
            height: window.innerHeight,
            overflow: 'unset',
            
        }}
        onContextMenu={(ev)=>ev.preventDefault()}
    />
}