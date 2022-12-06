import React, { useState, useEffect, useRef }  from 'react';
import styled from 'styled-components';
import * as THREE from 'three/src/Three';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei'


// CSS in JS
const Figure = styled.figure`
  canvas {
    box-shadow: 0 0 15px 2px rgb(0 0 0 / 10%);
  }
`;

// Component
function Inner() {
  const [canvasSize, setCanvasSize] = useState(0);
  const figureElm = useRef(null);

  const changeCanvasSize = (canvasElmWidth) => {
    if (canvasElmWidth < 900) {
      setCanvasSize(canvasElmWidth);
    } else {
      setCanvasSize(900);
    }
  }

  useEffect(() => {
    const canvasElmWidth = figureElm.current.clientWidth;
    // console.log('canvasElmWidth(load)', canvasElmWidth);
    changeCanvasSize(canvasElmWidth);

    window.addEventListener('resize', () => {
      const canvasElmWidth = figureElm.current.clientWidth;
      // console.log('canvasElmWidth(resize)', canvasElmWidth);
      changeCanvasSize(canvasElmWidth);
    });
  }, [0]);


  const Cube = () => {
    const ref = useRef(null);
    useFrame(() => {
      ref.current.rotation.x += 0.01;
      ref.current.rotation.y += 0.01;
    });

    return (
      <mesh ref={ref}>
        <PerspectiveCamera
          args={[35, canvasSize / canvasSize, 0.1, 1000]}
          position={[0, 0, 5]}
        />
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    );
  }


  // JSX
  return (
    <>
      <div id="canvas-container" style={{
        width: canvasSize + "px",
        height: canvasSize + "px",
        background: "#000"
      }}>
        <Canvas ref={figureElm}>
          <hemisphereLight args={[0xffffbb, 0x080820, 1]} />
          <Cube />
        </Canvas>
      </div>
    </>

  );
}

export default Inner;
