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


  const getRandomAarry = () => {
    const length = 3;
    const max = 50;
    const array = [];

    for (let i = 0; i < length; i++) {
      const random = (Math.floor(Math.random() * max)) - (max / 2 );
      array.push(random);
    }

    return array;
  }

  useEffect(() => {
    // three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 45, canvasSize / canvasSize, 1, 500 );
    camera.position.set( 0, 0, 100 );
    camera.lookAt( 0, 0, 0 );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( canvasSize, canvasSize );

    if (figureElm.current.firstChild) {
      figureElm.current.removeChild( figureElm.current.firstChild );
    }
    figureElm.current.appendChild( renderer.domElement );

    const points = [];
    for (let i = 0; i < 50; i++ ) {
      const rundomArray = getRandomAarry();
      const xNumber = rundomArray[0];
      const yNumber = rundomArray[1];
      const zNumber = rundomArray[2];
      points.push( new THREE.Vector3(xNumber, yNumber, zNumber) );
    }

    const geometry = new THREE.BufferGeometry().setFromPoints( points );

    const material = new THREE.PointsMaterial({
      color: 0xffdd00,
      size: 1.5
    });

    const line = new THREE.Points( geometry, material );
    scene.add( line );

    const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    scene.add( light );

    function animate() {
      requestAnimationFrame( animate );

      line.rotation.x += 0.01;
      line.rotation.y += 0.01;

      renderer.render( scene, camera );
    };

    animate();
  }, [canvasSize]);

  // JSX
  return (
    <Figure ref={figureElm}></Figure>
  );
}

export default Inner;
