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
  const cubeColors = [0xffffff, 0xff0000];
  const initColorValue = [
    { uuid: 0, color: cubeColors[0] },
    { uuid: 0, color: cubeColors[0] },
    { uuid: 0, color: cubeColors[0] },
    { uuid: 0, color: cubeColors[0] },
    { uuid: 0, color: cubeColors[0] },
    { uuid: 0, color: cubeColors[0] },
    { uuid: 0, color: cubeColors[0] },
    { uuid: 0, color: cubeColors[0] },
    { uuid: 0, color: cubeColors[0] }
  ];

  const [canvas, setCanvas] = useState(null);
  const [canvasSize, setCanvasSize] = useState(0);
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [cameraPositionX, setCameraPositionX] = useState(0);
  const [cameraPositionY, setCameraPositionY] = useState(0);
  const [cameraPositionZ, setCameraPositionZ] = useState(50);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);
  const [pickPositionX, setPickPositionX] = useState(0);
  const [pickPositionY, setPickPositionY] = useState(0);
  const [cubeValue, setCubeValue] = useState(initColorValue);
  const figureElm = useRef(null);
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();


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
  }, [0]);


  useEffect(() => {
    // three.js
    const scene = new THREE.Scene();
    setScene(scene);

    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize( canvasSize, canvasSize );

    if (figureElm.current.firstChild) {
      figureElm.current.removeChild( figureElm.current.firstChild );
    }
    figureElm.current.appendChild( renderer.domElement );
    setCanvas(figureElm.current.firstChild);

    // Camera
    const fov = 35;
    const aspect = canvasSize / canvasSize;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.copy(new THREE.Vector3(cameraPositionX, cameraPositionY, cameraPositionZ));
    setCamera(camera);

    const controls = new OrbitControls(camera, figureElm.current.firstChild);
    controls.update();

    // Light
    const light = new THREE.HemisphereLight( 0xffffff, 0x080820, 1 );
    scene.add( light );

    // Geometry
    const geometry = new THREE.BoxGeometry( 6, 6, 6 );

    const resultCubeValue = [];
    function makeInstance(geometry, color, x, y) {
      const material = new THREE.MeshPhongMaterial({color: color});

      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      cube.position.x = x;
      cube.position.y = y;

      resultCubeValue.push({
        uuid: cube.uuid,
        color: color
      });
      setCubeValue(resultCubeValue);

      return cube;
    }

    const cubes = [
      makeInstance(geometry, cubeValue[0].color, -10, 10),
      makeInstance(geometry, cubeValue[1].color, 0, 10),
      makeInstance(geometry, cubeValue[2].color, 10, 10),
      makeInstance(geometry, cubeValue[3].color, -10, 0),
      makeInstance(geometry, cubeValue[4].color, 0, 0),
      makeInstance(geometry, cubeValue[5].color, 10, 0),
      makeInstance(geometry, cubeValue[6].color, -10, -10),
      makeInstance(geometry, cubeValue[7].color, 0, -10),
      makeInstance(geometry, cubeValue[8].color, 10, -10),
    ];

    const term = 300;
    let timer = 0;
    window.addEventListener('resize', () => {
      clearTimeout(timer);

      // @ts-ignore
      timer = setTimeout(() => {
        const canvasElmWidth = figureElm.current.clientWidth;
        // console.log('canvasElmWidth(resize)', canvasElmWidth);
        changeCanvasSize(canvasElmWidth);

        setCameraPositionX(camera.position.x);
        setCameraPositionY(camera.position.y);
        setCameraPositionZ(camera.position.z);
        camera.position.copy(new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z));
        setCamera(camera);

      }, term);

    });


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


  function getCanvasRelativePosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * canvas.width  / rect.width,
      y: (event.clientY - rect.top ) * canvas.height / rect.height,
    };
  }

  function changeColor(uuid, color) {
    const resultCubeValue = cubeValue;
    for (let i = 0; i < resultCubeValue.length; i++){
      // @ts-ignore
      if (resultCubeValue[i].uuid === uuid) {
        resultCubeValue.splice( i, 1, {
          // @ts-ignore
          uuid: uuid,
          color: color
        });
      }
    }
    // console.log('resultCubeValue', resultCubeValue);
    setCubeValue(resultCubeValue);
  }

  function setPickPosition(event) {
    const pos = getCanvasRelativePosition(event);
    const pickPosition = {
      x: (pos.x / canvas.width ) *  2 - 1,
      y: (pos.y / canvas.height) * -2 + 1, // note we flip Y
    };

    setPositionX(pos.x);
    setPositionY(pos.y);
    setPickPositionX(pickPosition.x);
    setPickPositionY(pickPosition.y);

    pointer.x = pickPosition.x;
	  pointer.y = pickPosition.y;

    raycaster.setFromCamera( pointer, camera );
    const intersects = raycaster.intersectObjects( scene.children );

    for ( let i = 0; i < intersects.length; i ++ ) {
      // @ts-ignore
      const color = intersects[i].object.material.color;
      const uuid = intersects[i].object.uuid;
      const hex = color.getHex();

      if (hex === cubeColors[1]) {
        color.set(cubeColors[0]);
        changeColor(uuid, cubeColors[0]);
      } else if (hex === cubeColors[0]) {
        color.set(cubeColors[1]);
        changeColor(uuid, cubeColors[1]);
      }
    }
  }

  // JSX
  return (
    <>
      <Figure ref={figureElm} onPointerDown={setPickPosition}></Figure>
      <ul>
        <li>canvas.width: {canvasSize}</li>
        <li>canvas.height: {canvasSize}</li>
        <li>position.x: {positionX}</li>
        <li>position.y: {positionY}</li>
        <li>pickPosition.x: {pickPositionX.toFixed(2)}</li>
        <li>pickPosition.y: {pickPositionY.toFixed(2)}</li>
      </ul>
    </>
  );
}

export default Inner;
