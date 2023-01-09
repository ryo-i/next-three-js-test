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

    const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    scene.add( light );


    // Basic
    const verticesOfCube1 = [
      -1, -1, -1,    1, -1, -1,    1,  1, -1,    -1,  1, -1,
      -1, -1,  1,    1, -1,  1,    1,  1,  1,    -1,  1,  1,
    ];

    const indicesOfFaces1 = [
        2, 1, 0,    0, 3, 2,
        0, 4, 7,    7, 3, 0,
        0, 1, 5,    5, 4, 0,
        1, 2, 6,    6, 5, 1,
        2, 3, 7,    7, 6, 2,
        4, 5, 6,    6, 7, 4,
    ];

    const geometry1 = new THREE.PolyhedronGeometry(
        verticesOfCube1,
        indicesOfFaces1,
        7, // ui: radius,
        2  // ui: detail
    );


    // Expansion
    const verticesOfCube2 = [
      -2, 8, -6,    3, 4, -8,    3,  -4, -3,    5,  -2, 1,
      -7, 4,  8,    3, 5,  -7,    4,  -7,  3,    -5,  -8,  3,
    ];

    const indicesOfFaces2 = [
        8, 4, 1,    2, 6, 1,
        3, 2, 8,    4, 1, 3,
        6, 2, 2,    0, 3, 9,
        4, 0, 3,    3, 1, 4,
        8, 5, 4,    3, 7, 3,
        3, 1, 0,    3, 2, 4,
    ];

    const geometry2 = new THREE.PolyhedronGeometry(
        verticesOfCube2,
        indicesOfFaces2,
        7, // ui: radius,
        2  // ui: detail
    );


    // Custom
    const verticesOfCube3 = [];
    const verticesOfCubeMax = 3;
    const verticesOfCubeMim = -3;

    for (let i = 0; i < 24; i++) {
      verticesOfCube3.push(
        Math.floor(Math.random() * (verticesOfCubeMax - verticesOfCubeMim + 1) + verticesOfCubeMim),
      );
    }
    console.log('verticesOfCube3', verticesOfCube3);

    const indicesOfFaces3 = [];
    const indicesOfFacesMax = 6;
    const indicesOfFacesMin = 0;

    for (let i = 0; i < 36; i++) {
      indicesOfFaces3.push(
        Math.floor(Math.random() * (indicesOfFacesMax - indicesOfFacesMin + 1) + indicesOfFacesMin),
      );
    }
    console.log('indicesOfFaces3', indicesOfFaces3);

    const geometry3 = new THREE.PolyhedronGeometry(
        verticesOfCube3,
        indicesOfFaces3,
        7, // ui: radius,
        2  // ui: detail
    );


    function makeInstance(geometry, color, x) {
      const material = new THREE.MeshPhongMaterial({color});
      const primitive = new THREE.Mesh(geometry, material);

      scene.add(primitive);
      primitive.position.x = x;

      return primitive;
    }

    const primitives = [
      makeInstance(geometry1, 'green',  -15),
      makeInstance(geometry2, 'yellow', 0),
      makeInstance(geometry3, 'red',  15),
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
