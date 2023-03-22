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
    camera.position.z = 20;

    const controls = new OrbitControls(camera, figureElm.current.firstChild);
    controls.update();

    // Light
    const color = '#ffffff';
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 10, 5);
    scene.add(light);

    // Texture
    const planeSize = 50;
    const loader = new THREE.TextureLoader();
    const texture = loader.load('../img/texture_1.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    // Box Geometry
    const geometry1 = new THREE.BoxGeometry( 2, 2, 2 );

    // Custom BufferGeometry
    const vertices = [
      // front
      { pos: [-1, -1,  1], norm: [ 0,  0,  1], uv: [0, 0], },
      { pos: [ 1, -1,  1], norm: [ 0,  0,  1], uv: [1, 0], },
      { pos: [-1,  1,  1], norm: [ 0,  0,  1], uv: [0, 1], },

      { pos: [-1,  1,  1], norm: [ 0,  0,  1], uv: [0, 1], },
      { pos: [ 1, -1,  1], norm: [ 0,  0,  1], uv: [1, 0], },
      { pos: [ 1,  1,  1], norm: [ 0,  0,  1], uv: [1, 1], },
      // right
      { pos: [ 1, -1,  1], norm: [ 1,  0,  0], uv: [0, 0], },
      { pos: [ 1, -1, -1], norm: [ 1,  0,  0], uv: [1, 0], },
      { pos: [ 1,  1,  1], norm: [ 1,  0,  0], uv: [0, 1], },

      { pos: [ 1,  1,  1], norm: [ 1,  0,  0], uv: [0, 1], },
      { pos: [ 1, -1, -1], norm: [ 1,  0,  0], uv: [1, 0], },
      { pos: [ 1,  1, -1], norm: [ 1,  0,  0], uv: [1, 1], },
      // back
      { pos: [ 1, -1, -1], norm: [ 0,  0, -1], uv: [0, 0], },
      { pos: [-1, -1, -1], norm: [ 0,  0, -1], uv: [1, 0], },
      { pos: [ 1,  1, -1], norm: [ 0,  0, -1], uv: [0, 1], },

      { pos: [ 1,  1, -1], norm: [ 0,  0, -1], uv: [0, 1], },
      { pos: [-1, -1, -1], norm: [ 0,  0, -1], uv: [1, 0], },
      { pos: [-1,  1, -1], norm: [ 0,  0, -1], uv: [1, 1], },
      // left
      { pos: [-1, -1, -1], norm: [-1,  0,  0], uv: [0, 0], },
      { pos: [-1, -1,  1], norm: [-1,  0,  0], uv: [1, 0], },
      { pos: [-1,  1, -1], norm: [-1,  0,  0], uv: [0, 1], },

      { pos: [-1,  1, -1], norm: [-1,  0,  0], uv: [0, 1], },
      { pos: [-1, -1,  1], norm: [-1,  0,  0], uv: [1, 0], },
      { pos: [-1,  1,  1], norm: [-1,  0,  0], uv: [1, 1], },
      // top
      { pos: [ 1,  1, -1], norm: [ 0,  1,  0], uv: [0, 0], },
      { pos: [-1,  1, -1], norm: [ 0,  1,  0], uv: [1, 0], },
      { pos: [ 1,  1,  1], norm: [ 0,  1,  0], uv: [0, 1], },

      { pos: [ 1,  1,  1], norm: [ 0,  1,  0], uv: [0, 1], },
      { pos: [-1,  1, -1], norm: [ 0,  1,  0], uv: [1, 0], },
      { pos: [-1,  1,  1], norm: [ 0,  1,  0], uv: [1, 1], },
      // bottom
      { pos: [ 1, -1,  1], norm: [ 0, -1,  0], uv: [0, 0], },
      { pos: [-1, -1,  1], norm: [ 0, -1,  0], uv: [1, 0], },
      { pos: [ 1, -1, -1], norm: [ 0, -1,  0], uv: [0, 1], },

      { pos: [ 1, -1, -1], norm: [ 0, -1,  0], uv: [0, 1], },
      { pos: [-1, -1,  1], norm: [ 0, -1,  0], uv: [1, 0], },
      { pos: [-1, -1, -1], norm: [ 0, -1,  0], uv: [1, 1], },
    ];

    const positions = [];
    const normals = [];
    const uvs = [];
    for (const vertex of vertices) {
      positions.push(...vertex.pos);
      normals.push(...vertex.norm);
      uvs.push(...vertex.uv);
    }

    const geometry2 = new THREE.BufferGeometry();
    const positionNumComponents = 3;
    const normalNumComponents = 3;
    const uvNumComponents = 2;
    geometry2.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents)
    );
    geometry2.setAttribute(
      'normal',
      new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents)
    );
    geometry2.setAttribute(
      'uv',
      new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents)
    );


    // Material
    const material1 = new THREE.MeshPhongMaterial({
      color: 0xff33f4,    // red (can also use a CSS color string here)
      // flatShading: true,
      shininess: 100,
      emissive: 0x222222,
      specular: 0xFFFFFF
    });

    const material2 = new THREE.MeshPhongMaterial({
      color: 0x049ef4,    // red (can also use a CSS color string here)
      // flatShading: true,
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
      makeInstance(geometry1, material1,  -2),
      makeInstance(geometry2, material2, 2)
    ];

    function render(time) {
      time *= 0.0005;  // convert time to seconds

      primitives.forEach((primitive, ndx) => {
        const speed = 1 + ndx * .025;
        const rot = time * speed;
        primitive.rotation.x = rot;
        primitive.rotation.y = rot;
      });

      renderer.render(scene, camera);

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
    // console.log('canvasSize', canvasSize)
  }, [canvasSize]);


  // JSX
  return (
    <>
      <Figure ref={figureElm}></Figure>
      <Dl></Dl>
    </>
  );
}

export default Inner;
