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
  const [angle, setAngle] = useState(0);
  const [rad, setRad] = useState(0);
  const [x, setX] = useState(1);
  const [y, setY] = useState(1);
  const figureElm = useRef(null);

  const changeCanvasSize = (canvasElmWidth) => {
    if (canvasElmWidth < 900) {
      setCanvasSize(canvasElmWidth);
    } else {
      setCanvasSize(900);
    }
  }


  const changeRange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const getName: string = String(e.target.name);
    const getValue: number = Number(e.target.value);

    switch (getName){
      case 'angle':
        const rad = getValue * (Math.PI / 180);
        const x = Math.cos(rad);
        const y = Math.sin(rad);
        console.log('rad', rad);
        console.log('x', x);
        console.log('y', y);

        setAngle(getValue);
        setRad(rad);
        setX(x);
        setY(y);
        break;
    }
  };

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
    camera.position.z = 20;

    const controls = new OrbitControls(camera, figureElm.current.firstChild);
    controls.update();

    // Light
    const color = '#ffffff';
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 10, 5);
    scene.add(light);

    // Custom BufferGeometry
    const vertices = [
      // front
      { pos: [-1, -1,  1], norm: [ 0,  0,  1], uv: [0, 0], },
      { pos: [ 1, -1,  1], norm: [ 0,  0,  1], uv: [1, 0], },
      { pos: [-1,  1,  1], norm: [ 0,  0,  1], uv: [0, 1], },
      { pos: [ 1,  1,  1], norm: [ 0,  0,  1], uv: [1, 1], },

      // right
      { pos: [ 1, -1,  1], norm: [ 1,  0,  0], uv: [0, 0], },
      { pos: [ 1, -1, -1], norm: [ 1,  0,  0], uv: [1, 0], },
      { pos: [ 1,  1,  1], norm: [ 1,  0,  0], uv: [0, 1], },
      { pos: [ 1,  1, -1], norm: [ 1,  0,  0], uv: [1, 1], },

      // back
      { pos: [ 1, -1, -1], norm: [ 0,  0, -1], uv: [0, 0], },
      { pos: [-1, -1, -1], norm: [ 0,  0, -1], uv: [1, 0], },
      { pos: [ 1,  1, -1], norm: [ 0,  0, -1], uv: [0, 1], },
      { pos: [-1,  1, -1], norm: [ 0,  0, -1], uv: [1, 1], },

      // left
      { pos: [-1, -1, -1], norm: [-1,  0,  0], uv: [0, 0], },
      { pos: [-1, -1,  1], norm: [-1,  0,  0], uv: [1, 0], },
      { pos: [-1,  1, -1], norm: [-1,  0,  0], uv: [0, 1], },
      { pos: [-1,  1,  1], norm: [-1,  0,  0], uv: [1, 1], },

      // top
      { pos: [ 1,  1, -1], norm: [ 0,  1,  0], uv: [0, 0], },
      { pos: [-1,  1, -1], norm: [ 0,  1,  0], uv: [1, 0], },
      { pos: [ 1,  1,  1], norm: [ 0,  1,  0], uv: [0, 1], },
      { pos: [-1,  1,  1], norm: [ 0,  1,  0], uv: [1, 1], },

      // bottom
      { pos: [ 1, -1,  1], norm: [ 0, -1,  0], uv: [0, 0], },
      { pos: [-1, -1,  1], norm: [ 0, -1,  0], uv: [1, 0], },
      { pos: [ 1, -1, -1], norm: [ 0, -1,  0], uv: [0, 1], },
      { pos: [-1, -1, -1], norm: [ 0, -1,  0], uv: [1, 1], },
    ];

    const numVertices = vertices.length;
    const positionNumComponents = 3;
    const normalNumComponents = 3;
    const uvNumComponents = 2;
    const positions = new Float32Array(numVertices * positionNumComponents);
    const normals = new Float32Array(numVertices * normalNumComponents);
    const uvs = new Float32Array(numVertices * uvNumComponents);
    let posNdx = 0;
    let nrmNdx = 0;
    let uvNdx = 0;

    for (const vertex of vertices) {
      positions.set(vertex.pos, posNdx);
      normals.set(vertex.norm, nrmNdx);
      uvs.set(vertex.uv, uvNdx);
      posNdx += positionNumComponents;
      nrmNdx += normalNumComponents;
      uvNdx += uvNumComponents;
    }
    // console.log('positions', positions);
    // console.log('normals', normals);
    // console.log('uvs', uvs);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, positionNumComponents)
    );
    geometry.setAttribute(
      'normal',
      new THREE.BufferAttribute(normals, normalNumComponents)
    );
    geometry.setAttribute(
      'uv',
      new THREE.BufferAttribute(uvs, uvNumComponents)
    );
    geometry.setIndex([
      0,  1,  2,   2,  1,  3,  // front
      4,  5,  6,   6,  5,  7,  // right
      8,  9, 10,  10,  9, 11,  // back
     12, 13, 14,  14, 13, 15,  // left
     16, 17, 18,  18, 17, 19,  // top
     20, 21, 22,  22, 21, 23,  // bottom
   ]);


    // Material
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
      primitive.rotation.x = 0.25;
      primitive.rotation.y = -0.25;

      return primitive;
    }

    const primitives = [
      makeInstance(geometry, material, 0)
    ];

    function render(time) {
      time *= 0.0005;  // convert time to seconds

      // primitives.forEach((primitive, ndx) => {
      //   const speed = 1 + ndx * .025;
      //   const rot = time * speed;
      //   primitive.rotation.x = rot;
      //   primitive.rotation.y = rot;
      // });

      renderer.render(scene, camera);

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
    // console.log('canvasSize', canvasSize)
  }, [canvasSize, angle, rad, x, y]);


  // JSX
  return (
    <>
      <Figure ref={figureElm}></Figure>
      <Dl>
        <dt>角度</dt>
        <dd>
          <label>
            <input type="range" name="angle" min="0" max="180" step="1" value={angle} onChange={changeRange} /> {angle}
          </label>
        </dd>
      </Dl>
    </>
  );
}

export default Inner;
