import { motion } from 'framer-motion';
import { lights, rects } from '../utils/elements';
import { useEffect, useState } from 'react';
import useAnimationFrame from '../hooks/useFrame';
import { setOnProps } from '../utils/vars';

export default function Properties() {

    const [selectedLights, setSelectedLights] = useState([
        ...lights.filter(light => light.selected),
    ]);
    const [selectedRects, setSelectedRects] = useState([
        ...rects.filter(rect => rect.selected)
    ]);

    const [intensity, setIntensity] = useState(10);
    const [angle, setAngle] = useState(0);
    const [color, setColor] = useState("#ffffff");
    const [rotation, setRotation] = useState(0);
    const [option, setOption] = useState(0);

    useEffect(() => {
        if (selectedLights.length > 0) {
            selectedLights[selectedLights.length - 1].rays = (intensity);
            selectedLights[selectedLights.length - 1].color = color;
            selectedLights[selectedLights.length - 1].angle = angle;
            selectedLights[selectedLights.length - 1].rotation = rotation;
        }

    }, [intensity, rotation, color, angle])

    useEffect(() => {
        window.addEventListener("keydown", event => {
            setSelectedRects([]);
            setSelectedLights([]);
        })
    }, [rects, lights])

    useEffect(() => {
        if (selectedRects.length > 0) {
            setOption(selectedRects[selectedRects.length - 1].mat);
        }
    }, [selectedRects])

    useEffect(() => {
        console.log(option)
        if (selectedRects.length > 0)
            setOption(selectedRects[selectedRects.length - 1].mat);
    }, [option, selectedRects])

    useEffect(() => {
        if (selectedLights.length > 0) {
            setColor(selectedLights[selectedLights.length - 1].color);
            setAngle(selectedLights[selectedLights.length - 1].angle);
            setIntensity(selectedLights[selectedLights.length - 1].rays);
            setRotation(selectedLights[selectedLights.length - 1].rotation);

        }
    }, [selectedLights])

    useEffect(() => {
        const mup = () => {
            setSelectedLights([
                ...lights.filter(light => light.selected),
            ]);
            setSelectedRects([
                ...rects.filter(rect => rect.selected)
            ])
        }
        window.addEventListener("mouseup", mup);
        return () => {
            window.removeEventListener("mouseup", mup)
        }
    }, [lights, rects])
    return <motion.div
        style={{
            width: '30vw',
            background: "rgba(7,7,7, 0.5)",
            position: "fixed",
            top: 25,
            left: 25,
            borderRadius: 16,
            border: "1.5px solid #ffffff77",
            backdropFilter: "blur(9px)",
            padding: '0.5rem',
            transition: "opacity .1s;",
            opacity: selectedLights.length + selectedRects.length > 0 ? 1 : 0,

        }}

        animate={{
            height: selectedLights.length + selectedRects.length > 0 ? 'auto' : 0,

        }}
        onMouseEnter={(event) => {
            setOnProps(true);
        }}
        onMouseLeave={(event) => {
            setOnProps(false);
        }}
    >

        {selectedLights.length > 0 ?

            <>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingRight: '1rem',
                        gap: '0.5rem',

                    }}
                >
                    <h2
                        style={{
                            color: 'white',
                            fontWeight: 'normal',
                            textAlign: 'center'

                        }}
                    >Color</h2>
                    <input
                        type={'color'}
                        style={{
                            height: '100%',
                            aspectRatio: 1,
                            border: 'none',
                            outline: 'none',
                            background: "transparent"
                        }}
                        value={color}
                        onChange={(ev) => {
                            const val = ev.target.value;
                            setColor(val);
                        }}

                    />
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',


                    }}
                >
                    <h2
                        style={{
                            color: 'white',
                            fontWeight: 'normal',

                        }}
                    >Angle</h2>
                    <input
                        type="range"
                        style={{
                            width: '100%',
                        }}
                        value={angle}
                        onChange={(ev) => {
                            const val = ev.target.value;
                            setAngle(parseFloat(val))
                        }}
                        min={0.1}
                        max={Math.PI}
                        step={0.001}

                    />
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',


                    }}
                >
                    <h2
                        style={{
                            color: 'white',
                            fontWeight: 'normal',

                        }}
                    >Intensity</h2>
                    <input
                        type="range"
                        style={{
                            width: '100%',
                        }}
                        value={intensity}
                        onChange={(ev) => {
                            const val = ev.target.value;
                            setIntensity(parseFloat(val))
                        }}
                        min={0.01}
                        max={30}
                        step={0.001}

                    />
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: 'center',
                        gap: '0.5rem',
                        alignItems: 'center'


                    }}
                >
                    <h2
                        style={{
                            color: 'white',
                            fontWeight: 'normal',

                        }}
                    >Rotation</h2>
                    <input
                        type="range"
                        value={rotation}
                        style={{
                            width: '100%',
                        }}
                        min={-Math.PI}
                        step={0.001}
                        max={Math.PI}
                        onChange={(ev) => {
                            setRotation(parseFloat(ev.target.value))
                        }}
                    />
                </div>

            </>
            : null}
        {selectedRects.length > 0 ? <>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingRight: '1rem',
                    gap: '0.5rem',

                }}
            >
                <h2
                    style={{
                        color: 'white',
                        fontWeight: 'normal',
                        textAlign: 'center'

                    }}
                >Material</h2>
                <select
                    style={{
                        height: '100%',
                        aspectRatio: 1,
                        border: 'none',
                        outline: 'none',
                        background: "transparent",
                        color: "white",

                    }}
                    value={option}
                    onChange={(ev) => {
                        const val = ev.target.value;
                        setOption(parseInt(val));
                    }}

                >
                    <option style={{ background: '#333' }} value={'0'} > Reflexive </option>
                    <option style={{ background: '#333' }} value={'1'} > Refractive </option>
                    <option value={'2'} style={{ background: '#333' }} > Reflexive & Refractive </option>
                    <option value={'3'} style={{ background: '#333' }} > Opaque </option>

                </select>
            </div>
        </> : null}
    </motion.div>
}