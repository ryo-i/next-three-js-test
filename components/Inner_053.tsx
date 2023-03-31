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

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( canvasSize, canvasSize );

    if (figureElm.current.firstChild) {
      figureElm.current.removeChild( figureElm.current.firstChild );
    }
    figureElm.current.appendChild( renderer.domElement );

    // Camera
    const camera = new THREE.PerspectiveCamera( 45, canvasSize / canvasSize, 1, 500 );
    camera.position.set( 0, 0, 100 );
    camera.lookAt( 0, 0, 0 );

    const controls = new OrbitControls(camera, figureElm.current.firstChild);
    controls.target.set(0, 5, 0);
    controls.update();

    // Light
    const color = '#ffffff';
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 10, 5);
    scene.add(light);

    // Custom BufferGeometry
    const positions = [];
    const normals = [];
    for (let i = 0; i < 100; i++ ) {
      const rundomArray = getRandomAarry();
      const xNumber = rundomArray[0];
      const yNumber = rundomArray[1];
      const zNumber = rundomArray[2];
      // positions.push( new THREE.Vector3(xNumber, yNumber, zNumber) );
      positions.push( xNumber, yNumber, zNumber );
    }
    console.log('positions', positions);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );

    const material = new THREE.MeshPhongMaterial({
      color: 0x049ef4,    // red (can also use a CSS color string here)
      flatShading: true,
      shininess: 100,
      emissive: 0x222222,
      specular: 0xFFFFFF
    });

    function makeInstance(geometry, material, x) {
      const primitive = new THREE.Mesh(geometry, material);

      scene.add(primitive);
      primitive.position.x = x;
      primitive.position.y = 0;

      return primitive;
    }

    const primitives = [
      makeInstance(geometry, material, 0)
    ];


    function render(time) {
      time *= 0.001;  // convert time to seconds

      renderer.render(scene, camera);

      primitives.forEach((mesh) => {
        mesh.rotation.x = time * 0.25;
				mesh.rotation.y = time * 0.5;
      });

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
