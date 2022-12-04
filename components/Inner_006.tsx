import React, { useState, useEffect, useRef }  from 'react';
import styled from 'styled-components';
import * as THREE from 'three/src/Three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

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
    const camera = new THREE.PerspectiveCamera( 45, canvasSize / canvasSize, 1, 10000 );
    camera.position.set( 0, 0, 5 );
    camera.lookAt( 0, 0, 0 );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( canvasSize, canvasSize );

    if (figureElm.current.firstChild) {
      figureElm.current.removeChild( figureElm.current.firstChild );
    }
    figureElm.current.appendChild( renderer.domElement );

      const loader = new GLTFLoader();


      loader.load( '/models/skull/scene.gltf', function ( gltf ) {

        scene.add( gltf.scene );

      }, undefined, function ( error ) {

        console.error( error );

      } );

      const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 3 );
      scene.add( light );

      function animate() {
        requestAnimationFrame( animate );

        scene.rotation.x += 0.01;
        scene.rotation.y += 0.01;

        renderer.render( scene, camera );
      };
      animate();

  }, [canvasSize]);

  // JSX
  return (
      <>
        <Figure ref={figureElm}></Figure>
        <p>Model: <a href="https://sketchfab.com/3d-models/skull-downloadable-1a9db900738d44298b0bc59f68123393" target="_blank">Skull downloadable</a> by martinjario</p>
      </>

  );
}

export default Inner;
