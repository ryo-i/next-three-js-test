import React, { useState, useEffect, useRef }  from 'react';
import styled from 'styled-components';
import * as THREE from 'three/src/Three';


// CSS in JS
const Figure = styled.figure`
  canvas {
    box-shadow: 0 0 15px 2px rgb(0 0 0 / 10%);
  }
`;

// Component
function Inner() {
  // Hooks
  const [canvasSize, setCanvasSize] = useState(0);

  const canvasElm = useRef(null);

  useEffect(() => {
    const canvasElmWidth = canvasElm.current.clientWidth;
    if (canvasElmWidth < 600) {
      setCanvasSize(canvasElmWidth);
    } else {
      setCanvasSize(600);
    }
  });

  useEffect(() => {
    // three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, canvasSize / canvasSize, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( canvasSize, canvasSize );
    canvasElm.current.appendChild( renderer.domElement );

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    camera.position.z = 5;

    function animate() {
      requestAnimationFrame( animate );

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render( scene, camera );
    };

    animate();
  }, [canvasSize]);

  // JSX
  return (
    <Figure className="canvasElm" ref={canvasElm}></Figure>
  );
}

export default Inner;
