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
  const [pointHex, setPointHex] = useState('#FFFFFF');
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(20);
  const [positionZ, setPositionZ] = useState(5);
  const [power, setPower] = useState(4000);
  const [decay, setDecay] = useState(1.5);
  const figureElm = useRef(null);

  const changeCanvasSize = (canvasElmWidth) => {
    if (canvasElmWidth < 900) {
      setCanvasSize(canvasElmWidth);
    } else {
      setCanvasSize(900);
    }
  }


  const changeColorPicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    const getName:string = String(e.target.name);
    const getValue: string = String(e.target.value);

    if (getName === 'pointHex') {
      setPointHex(getValue);
    }
  };

  const changeRange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const getName: string = String(e.target.name);
    const getValue: number = Number(e.target.value);

    switch (getName){
      case 'positionX':
        setPositionX(getValue);
        break;
      case 'positionY':
        setPositionY(getValue);
        break;
      case 'positionZ':
        setPositionZ(getValue);
        break;
      case 'power':
        setPower(getValue);
        break;
      case 'decay':
        setDecay(getValue);
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
    // @ts-ignore
    renderer.physicallyCorrectLights = true; // Property 'physicallyCorrectLights' does not exist on type 'WebGLRenderer'.
    renderer.setSize( canvasSize, canvasSize );

    if (figureElm.current.firstChild) {
      figureElm.current.removeChild( figureElm.current.firstChild );
    }
    figureElm.current.appendChild( renderer.domElement );

    const fov = 45;
    const aspect = canvasSize / canvasSize;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.y = 15;
    camera.position.z = 70;
    // const cameraHelper = new THREE.CameraHelper( camera );
    // scene.add( cameraHelper );

    const controls = new OrbitControls(camera, figureElm.current.firstChild);
    controls.target.set(0, 5, 0);
    controls.update();

    // Light
    const color = pointHex;
    const intensity = 1;
    // @ts-ignore
    const light = new THREE.PointLight(color, intensity); // Error color
    light.position.set(positionX, positionY, positionZ);
    light.power = power;
    light.decay = decay;
    light.distance = Infinity;
    scene.add(light);
    const ligntHelper = new THREE.PointLightHelper( light );
    scene.add( ligntHelper );

    const updateLight = () => {
      ligntHelper.update();
    }
    updateLight();

    // Texture
    const planeSize = 50;
    const loader = new THREE.TextureLoader();
    const texture = loader.load('../img/texture_1.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    // Floor
    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const floorMesh = new THREE.Mesh(planeGeo, planeMat);
    floorMesh.rotation.x = Math.PI * -.5;
    floorMesh.position.y = -5;
    scene.add(floorMesh);

    // Geometry
    const geometry1 = new THREE.BoxGeometry( 12, 12, 12 );

    const geometry2 = new THREE.TorusGeometry(
      6, // ui: radius,
      3, // ui: tubeRadius,
      80, // ui: radialSegments,
      120, // ui: tubularSegments
      Math.PI * 2 // ui: arc
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
      primitive.position.y = 5;

      return primitive;
    }

    const primitives = [
      makeInstance(geometry1, material1,  -10),
      makeInstance(geometry2, material2, 10)
    ];

    function render(time) {
      time *= 0.0005;  // convert time to seconds

      // primitives.forEach((primitive, ndx) => {
      //   const speed = 1 + ndx * .1;
      //   const rot = time * speed;
      //   primitive.rotation.x = rot;
      //   primitive.rotation.y = rot;
      // });

      // floorMesh.rotation.z += 0.002;

      renderer.render(scene, camera);

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
    // console.log('canvasSize', canvasSize)
  },
    [
      canvasSize, pointHex,
      positionX, positionY, positionZ,
      power, decay
    ]
  );


  // JSX
  return (
    <>
      <Figure ref={figureElm}></Figure>
      <Dl>
        <dt>position</dt>
        <dd>
          <ul>
            <li>
              <label>
                <input type="range" name="positionX" min="-20" max="20" step="0.1" value={positionX} onChange={changeRange} /> x: {positionX}
              </label>
            </li>
            <li>
              <label>
                <input type="range" name="positionY" min="-20" max="20" step="0.1" value={positionY} onChange={changeRange} /> y: {positionY}
              </label>
            </li>
            <li>
              <label>
                <input type="range" name="positionZ" min="-20" max="20" step="0.1" value={positionZ} onChange={changeRange} /> z: {positionZ}
              </label>
            </li>
          </ul>
        </dd>
        <dt>power</dt>
        <dd>
          <ul>
            <li>
              <label>
                <input type="range" name="power" min="0" max="6000" step="0.1" value={power} onChange={changeRange} /> {power}
              </label>
            </li>
          </ul>
        </dd>
        <dt>decay</dt>
        <dd>
          <ul>
            <li>
              <label>
                <input type="range" name="decay" min="0" max="4" step="0.1" value={decay} onChange={changeRange} /> {decay}
              </label>
            </li>
          </ul>
        </dd>
        <dt>Lite color</dt>
        <dd>
          <ul>
            <li>
              <label>
                <input type="color" name="pointHex" value={pointHex} onChange={changeColorPicker} />
                color: {pointHex}
              </label>
            </li>
          </ul>
        </dd>
      </Dl>
    </>
  );
}

export default Inner;
