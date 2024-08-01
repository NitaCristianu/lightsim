import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { mode_atom, mode_hold_atom } from './vars';

export default function Corner() {
    const [mode, setMode] = useAtom(mode_atom);
    const [mode_hold, setModeHold] = useAtom(mode_hold_atom);
    // false - light
    // true -  rect
    return <motion.div
        style={{
            background: "rgba(35, 35, 35, 0.227)",
            backdropFilter: "blur(4px)",
            border: "1.5px solid #ffffffaa",
            borderRadius: 8,
            width: "5rem",
            aspectRatio: 1,
            position: 'fixed',
            left: "calc(100% - 5rem - 85px)",
            top: "calc(100% - 5rem - 85px)",
            alignItems: 'center',
            justifyContent: 'center',
            display: "flex",
        }}
        onHoverStart={() => setModeHold(true)}
        onHoverEnd={() => setModeHold(false)}
        whileHover={{
            width: "5.4rem"
        }}
        whileTap={{
            rotate: 180
        }}
        onTap={() => {
            setMode(prev => !prev);
        }}
    >
        {!mode ? <svg width={3.5 * 16} fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><title>lightbulb</title><path d="M12,2A7,7,0,0,0,8,14.74V17a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V14.74A7,7,0,0,0,12,2ZM9,21a1,1,0,0,0,1,1h4a1,1,0,0,0,1-1V20H9Z"></path></g></svg> : null}
        {mode ? <svg width={3.5 * 16} fill="#ffffff" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>square</title> <path d="M12.826 11.889c0 0 0 0-0 0-0.504 0-0.912 0.408-0.912 0.912 0 0 0 0 0 0v0 6.361c0 0.001 0 0.002 0 0.004 0 0.495 0.401 0.896 0.896 0.896 0.001 0 0.003 0 0.004 0h6.373c0 0 0 0 0 0 0.499 0 0.905-0.401 0.912-0.899v-6.361c0-0.504-0.408-0.912-0.912-0.912v0h-6.361zM8.040 6.453h15.92c0.87 0.002 1.575 0.708 1.575 1.579 0 0.003 0 0.006-0 0.009v-0 15.92c0 0.003 0 0.005 0 0.008 0 0.87-0.704 1.576-1.574 1.579h-15.921c-0.87-0.002-1.575-0.708-1.575-1.579 0-0.003 0-0.006 0-0.009v0-15.92c0 0 0-0 0-0 0-0.872 0.703-1.58 1.574-1.587h0.001zM6.015 1.004c-2.768 0-5.011 2.244-5.011 5.011v0 19.969c0.009 2.764 2.247 5.002 5.010 5.011h19.97c2.766-0.004 5.007-2.245 5.011-5.011v-19.982c-0.007-2.762-2.248-4.999-5.011-4.999h-19.969z"></path> </g></svg> : null}
    </motion.div>
}