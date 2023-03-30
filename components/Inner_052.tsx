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

const Dl = styled.dl`
  display: block;
  dd {
    font-size: 16px;
    ul, li {
      margin: 0;
    }
  }
  input[type='color'] {
    margin: 0 0.5em 0 0;
    padding: 0;
    border: none;
    background: none;
    appearance: none;
    width: 1em;
    height: 1em;
    ::-webkit-color-swatch {
      border: #ddd 1px solid;
      border-radius: 0;
    }
    ::-webkit-color-swatch-wrapper {
      margin: 0;
      padding: 0;
      width: 1em;
      height: 1em;
      border: none;
    }
  }
  input[type='range'] {
    width: 70%;
  }
`;

// Component
function Inner() {
  const [canvasSize, setCanvasSize] = useState(0);
  const figureElm = useRef(null);
  const [segmentsAround, setSegmentsAround] = useState(24);
  const [segmentsDown, setSegmentsDown] = useState(16);

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

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( canvasSize, canvasSize );

    if (figureElm.current.firstChild) {
      figureElm.current.removeChild( figureElm.current.firstChild );
    }
    figureElm.current.appendChild( renderer.domElement );

    // Camera
    const fov = 25;
    const aspect = canvasSize / canvasSize;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 80;

    const controls = new OrbitControls(camera, figureElm.current.firstChild);
    controls.update();

    // Light
    const light = new THREE.HemisphereLight();
    light.position.set(0, 10, 5);
    scene.add(light);

    // Custom BufferGeometry
    const geometry = new THREE.BufferGeometry();
    const indices = [];
    const vertices = [];
    const normals = [];
    const colors = [];
    const size = 20;
    const segments = 10;
    const halfSize = size / 2;
    const segmentSize = size / segments;

    // generate vertices, normals and color data for a simple grid geometry
    for ( let i = 0; i <= segments; i ++ ) {
      const y = ( i * segmentSize ) - halfSize;

      for ( let j = 0; j <= segments; j ++ ) {
        const x = ( j * segmentSize ) - halfSize;
        vertices.push( x, - y, 0 );
        normals.push( 0, 0, 1 );

        const r = ( x / size ) + 0.5;
        const g = ( y / size ) + 0.5;
        colors.push( r, g, 1 );
      }
    }

    // generate indices (data for element array buffer)
    for ( let i = 0; i < segments; i ++ ) {
      for ( let j = 0; j < segments; j ++ ) {
        const a = i * ( segments + 1 ) + ( j + 1 );
        const b = i * ( segments + 1 ) + j;
        const c = ( i + 1 ) * ( segments + 1 ) + j;
        const d = ( i + 1 ) * ( segments + 1 ) + ( j + 1 );

        // generate two faces (triangles) per iteration
        indices.push( a, b, d ); // face one
        indices.push( b, c, d ); // face two
      }
    }

    geometry.setIndex( indices );
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    geometry.setAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) );
    geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
    console.log('vertices', vertices);
    console.log('normals', normals);
    console.log('colors', colors);

    // Material
    const material = new THREE.MeshPhongMaterial( {
      side: THREE.DoubleSide,
      vertexColors: true
    } );

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

    const temp = new THREE.Vector3();

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
    // console.log('canvasSize', canvasSize)
  }, [
    canvasSize,
    segmentsAround, segmentsDown
  ]);


  // JSX
  return (
    <>
      <Figure ref={figureElm}></Figure>
      <Dl></Dl>
    </>
  );
}

export default Inner;
