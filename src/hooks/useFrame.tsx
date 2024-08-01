import { useEffect, useRef } from 'react';

const useAnimationFrame = (callback: any) => {
  // Store callback in a ref to avoid re-creating it on each render
  const callbackRef = useRef(callback);
  const requestRef = useRef(0);
  const previousTimeRef = useRef(0);

  useEffect(() => {
    // Update the callback reference on each render if it changes
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        // Call the callback function with deltaTime
        callbackRef.current(deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []); // Empty dependency array ensures this effect runs only once
};

export default useAnimationFrame;