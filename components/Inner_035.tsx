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


  useEffect(() => {
    if (!canvasSize) {
      return;
    }

    // three.js
    const scene = new THREE.Scene();

    const fov = 35;
    const aspect = canvasSize / canvasSize;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.z = 80;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( canvasSize, canvasSize );
    if (figureElm.current.firstChild) {
      figureElm.current.removeChild( figureElm.current.firstChild );
    }
    figureElm.current.appendChild( renderer.domElement );

    // const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    const light = new THREE.DirectionalLight( 0xffffbb, 1 );
    scene.add( light );


    // BoxGeometry
    const geometry1 = new THREE.BoxGeometry( 8, 8, 8 );


    // CylinderGeometry
    const geometry2 = new THREE.CylinderGeometry(
      4, // ui: radiusTop
      4, // ui: radiusBottom
      8, // ui: height
      24 // ui: radialSegments
    );


    // TorusKnotGeometry
    const geometry3 = new THREE.TorusKnotGeometry(
      3.5, // ui: radius,
      1.5, // ui: tubeRadius,
      64, // ui: tubularSegments,
      8, // ui: radialSegments,
      2, // ui: p,
      3 // ui: q
    );


    // Texture
    const loader = new THREE.TextureLoader();
    const material = new THREE.MeshBasicMaterial({
      map: loader.load('../img/texture_1.jpg')
    });

    function makeInstance(geometry, material, x) {
      const primitive = new THREE.Mesh(geometry, material);

      scene.add(primitive);
      primitive.position.x = x;

      return primitive;
    }

    const primitives = [
      makeInstance(geometry1, material,  -15),
      makeInstance(geometry2, material, 0),
      makeInstance(geometry3, material,  15),
    ];

    function render(time) {
      time *= 0.0005;  // convert time to seconds

      primitives.forEach((primitive, ndx) => {
        const speed = 1 + ndx * .1;
        const rot = time * speed;
        primitive.rotation.x = rot;
        primitive.rotation.y = rot;
      });

      renderer.render(scene, camera);

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
    console.log('canvasSize', canvasSize)
  }, [canvasSize]);


  // JSX
  return (
    <Figure ref={figureElm}></Figure>
  );
}

export default Inner;
