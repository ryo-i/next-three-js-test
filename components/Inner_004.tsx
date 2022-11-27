import React, { useState, useEffect, useRef }  from 'react';
import styled from 'styled-components';
import * as THREE from 'three/src/Three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

console.log('FontLoader', FontLoader);
console.log('TextGeometry', TextGeometry);


// CSS in JS
const Wrapper = styled.div`
  position: relative;
  #info {
    position: absolute;
    bottom: 10px;
    width: 100%;
    text-align: center;
    z-index: 100;
    display: block;
    color: #fff;
  }
`;
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
    const camera = new THREE.PerspectiveCamera( 45, canvasSize / canvasSize, 1, 500 );
    camera.position.set( 0, 0, 100 );
    camera.lookAt( 0, 0, 0 );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( canvasSize, canvasSize );

    if (figureElm.current.firstChild) {
      figureElm.current.removeChild( figureElm.current.firstChild );
    }
    figureElm.current.appendChild( renderer.domElement );

    const loader = new FontLoader();
    loader.load( 'three/fonts/helvetiker_regular.typeface.json', ( font ) => {
      const geometry = new TextGeometry( 'Hello three.js!', {
        font: font,
        size: 80,
        height: 5,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 10,
        bevelSize: 8,
        bevelOffset: 0,
        bevelSegments: 5
      } );

      const material = new THREE.MeshStandardMaterial( { color: 0xff0000 } );
      const text = new THREE.Mesh( geometry, material );
      scene.add( text );

      const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
      scene.add( light );

      function animate() {
        requestAnimationFrame( animate );

        text.rotation.x += 0.01;
        text.rotation.y += 0.01;

        renderer.render( scene, camera );
      };
      animate();
    } );
  }, [canvasSize]);

  // JSX
  return (
    <Wrapper className="wrapper">
      <Figure ref={figureElm}></Figure>
      <p id="info">字幕的なテキスト</p>
    </Wrapper>
  );
}

export default Inner;
