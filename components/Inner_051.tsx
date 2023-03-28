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

  const changeRange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const getName: string = String(e.target.name);
    const getValue: number = Number(e.target.value);

    switch (getName){
      case 'segmentsAround':
        setSegmentsAround(getValue);
        break;
      case 'segmentsDown':
        setSegmentsDown(getValue);
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
    camera.position.z = 10;

    const controls = new OrbitControls(camera, figureElm.current.firstChild);
    controls.update();

    // Light
    const color = '#ffffff';
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 10, 5);
    scene.add(light);

    // Custom BufferGeometry
    function makeSpherePositions(segmentsAround, segmentsDown) {
      const numVertices = segmentsAround * segmentsDown * 6;
      const numComponents = 3;
      const positions = new Float32Array(numVertices * numComponents);
      const indices = [];

      const longHelper = new THREE.Object3D();
      const latHelper = new THREE.Object3D();
      const pointHelper = new THREE.Object3D();
      longHelper.add(latHelper);
      latHelper.add(pointHelper);
      pointHelper.position.z = 1;
      const temp = new THREE.Vector3();

      function getPoint(lat, long) {
        latHelper.rotation.x = lat;
        longHelper.rotation.y = long;
        longHelper.updateMatrixWorld(true);
        return pointHelper.getWorldPosition(temp).toArray();
      }

      let posNdx = 0;
      let ndx = 0;
      for (let down = 0; down < segmentsDown; ++down) {
        const v0 = down / segmentsDown;
        const v1 = (down + 1) / segmentsDown;
        const lat0 = (v0 - 0.5) * Math.PI;
        const lat1 = (v1 - 0.5) * Math.PI;

        for (let across = 0; across < segmentsAround; ++across) {
          const u0 = across / segmentsAround;
          const u1 = (across + 1) / segmentsAround;
          const long0 = u0 * Math.PI * 2;
          const long1 = u1 * Math.PI * 2;

          positions.set(getPoint(lat0, long0), posNdx);  posNdx += numComponents;
          positions.set(getPoint(lat1, long0), posNdx);  posNdx += numComponents;
          positions.set(getPoint(lat0, long1), posNdx);  posNdx += numComponents;
          positions.set(getPoint(lat1, long1), posNdx);  posNdx += numComponents;

          indices.push(
            ndx, ndx + 1, ndx + 2,
            ndx + 2, ndx + 1, ndx + 3,
          );
          ndx += 4;
        }
      }
      // console.log('positions', positions);
      // console.log('indices', indices);
      return {positions, indices};
    }

    const {positions, indices} = makeSpherePositions(segmentsAround, segmentsDown);

    const normals = positions.slice();

    const geometry = new THREE.BufferGeometry();
    const positionNumComponents = 3;
    const normalNumComponents = 3;

    const positionAttribute = new THREE.BufferAttribute(positions, positionNumComponents);
    positionAttribute.setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute(
        'position',
        positionAttribute);
    geometry.setAttribute(
        'normal',
        new THREE.BufferAttribute(normals, normalNumComponents));
    geometry.setIndex(indices);

    // Material
    const material = new THREE.MeshPhongMaterial({
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
      makeInstance(geometry, material, 0)
    ];

    const temp = new THREE.Vector3();

    function render(time) {
      time *= 0.001;  // convert time to seconds

      for (let i = 0; i < positions.length; i += 3) {
        const quad = (i / 12 | 0);
        const ringId = quad / segmentsAround | 0;
        const ringQuadId = quad % segmentsAround;
        const ringU = ringQuadId / segmentsAround;
        const angle = ringU * Math.PI * 2;
        temp.fromArray(normals, i);
        temp.multiplyScalar(THREE.MathUtils.lerp(1, 1.4, Math.sin(time + ringId + angle) * .5 + .5));
        temp.toArray(positions, i);
      }
      positionAttribute.needsUpdate = true;

      renderer.render(scene, camera);

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
      <Dl>
      <dt>segmentsAround</dt>
        <dd>
          <ul>
            <li>
              <label>
                <input type="range" name="segmentsAround" min="3" max="50" step="1" value={segmentsAround} onChange={changeRange} /> {segmentsAround}
              </label>
            </li>
          </ul>
        </dd>
        <dt>segmentsDown</dt>
        <dd>
          <ul>
            <li>
              <label>
                <input type="range" name="segmentsDown" min="3" max="50" step="1" value={segmentsDown} onChange={changeRange} /> {segmentsDown}
              </label>
            </li>
          </ul>
        </dd>

      </Dl>
    </>
  );
}

export default Inner;
