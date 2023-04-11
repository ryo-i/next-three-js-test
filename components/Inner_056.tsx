import React, { useState, useEffect, useRef }  from 'react';
import styled from 'styled-components';
import * as THREE from 'three/src/Three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


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

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( canvasSize, canvasSize );

    if (figureElm.current.firstChild) {
      figureElm.current.removeChild( figureElm.current.firstChild );
    }
    figureElm.current.appendChild( renderer.domElement );

    // Camera
    const fov = 35;
    const aspect = canvasSize / canvasSize;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.z = 50;

    const controls = new OrbitControls(camera, figureElm.current.firstChild);
    controls.update();

    // Light
    const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    scene.add( light );

    // Geometry
    const geometry = new THREE.BoxGeometry( 6, 6, 6 );

    function makeInstance(geometry, color, x) {
      const material = new THREE.MeshPhongMaterial({color});

      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      cube.position.x = x;

      return cube;
    }

    const cubes = [
      makeInstance(geometry, 'green',  -10),
      makeInstance(geometry, 'yellow', 0),
      makeInstance(geometry, 'red',  10),
    ];

    // Pick Event
    const pickPosition = {x: 0, y: 0};
    const canvas = figureElm.current.firstChild;

    function getCanvasRelativePosition(event) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (event.clientX - rect.left) * canvas.width  / rect.width,
        y: (event.clientY - rect.top ) * canvas.height / rect.height,
      };
    }

    function setPickPosition(event) {
      if (canvasSize !== 0) {
        const pos = getCanvasRelativePosition(event);
        pickPosition.x = (pos.x / canvas.width ) *  2 - 1;
        pickPosition.y = (pos.y / canvas.height) * -2 + 1;  // note we flip Y
        if (pos.x >= 0 && pos.x <= canvas.width && pos.y >= 0 && pos.y <= canvas.height) {
          console.log('pos.x', pos.x);
          console.log('pos.y', pos.y);
          console.log('canvas.width ', canvas.width );
          console.log('canvas.height', canvas.height);
          console.log('pickPosition', pickPosition);
        }
      }
    }

    window.addEventListener('click', setPickPosition);

    function render(time) {
      time *= 0.0005;  // convert time to seconds

      cubes.forEach((cube, ndx) => {
        const speed = 1 + ndx * .1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
      });

      renderer.render(scene, camera);

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

  }, [canvasSize]);


  // JSX
  return (
    <Figure ref={figureElm}></Figure>
  );
}

export default Inner;
