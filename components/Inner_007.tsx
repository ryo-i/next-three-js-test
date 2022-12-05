import React, { useState, useEffect, useRef }  from 'react';
import styled from 'styled-components';
import * as THREE from 'three/src/Three';
import { Canvas, useFrame } from '@react-three/fiber';


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


  useEffect(() => {
    // three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 35, canvasSize / canvasSize, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( canvasSize, canvasSize );

    if (figureElm.current.firstChild) {
      figureElm.current.removeChild( figureElm.current.firstChild );
    }
    figureElm.current.appendChild( renderer.domElement );

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshStandardMaterial( { color: 0xff0000 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    camera.position.z = 5;

    const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    scene.add( light );

    function animate() {
      requestAnimationFrame( animate );

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render( scene, camera );
    };

    animate();
  }, [canvasSize]);


  const Div = styled.div`
    width: ${canvasSize}px;
    height: ${canvasSize}px;
    background: #000;
  `;


  const Cube = () => {
    const ref = useRef(null);
    useFrame(() => {
      ref.current.rotation.x += 0.01;
      ref.current.rotation.y += 0.01;
    });

    return (
      <mesh ref={ref}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="0xff0000" />
      </mesh>
    );
  }


  // JSX
  return (
    <>
      <Figure ref={figureElm}></Figure>
      <Div id="canvas-container">
        <Canvas>
          <hemisphereLight args={[0xffffbb, 0x080820, 1]} />
          <Cube />
        </Canvas>
      </Div>
    </>

  );
}

export default Inner;
