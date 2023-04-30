import React, { useState, useEffect, useRef }  from 'react';
import styled from 'styled-components';
import * as THREE from 'three/src/Three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// CSS in JS
const Figure = styled.figure`
  canvas {
    box-shadow: 0 0 15px 2px rgb(0 0 0 / 10%);
  }
`;


// Component
function Inner() {
  const figureElm = useRef(null);
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const cubeColors = [0xffffff, 0xff0000];
  const initCameraPositionZ = 300;


  const getInitColorValue = (length, min, max) => {
    const array = [];
    for (let i = 0; i < length; i++) {
      const rundomNumber = () => Math.floor(Math.random() * (max - min + 1) + min);
      array.push(
        {
          uuid: 0,
          color: cubeColors[0],
          x: rundomNumber(),
          y: rundomNumber(),
          z: rundomNumber()
        }
      );
    }
    return array;
  }


  const changeCanvasSize = (canvasElmWidth) => {
    if (canvasElmWidth < 900) {
      setCanvasSize(canvasElmWidth);
    } else {
      setCanvasSize(900);
    }
  }


  const [canvas, setCanvas] = useState(null);
  const [canvasSize, setCanvasSize] = useState(0);
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [cameraPositionX, setCameraPositionX] = useState(0);
  const [cameraPositionY, setCameraPositionY] = useState(0);
  const [cameraPositionZ, setCameraPositionZ] = useState(initCameraPositionZ);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);
  const [pickPositionX, setPickPositionX] = useState(0);
  const [pickPositionY, setPickPositionY] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [cubeValue, setCubeValue] = useState(getInitColorValue(20, -30, 30));


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
    const fov = 100;
    const aspect = canvasSize / canvasSize;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.copy(new THREE.Vector3(cameraPositionX, cameraPositionY, cameraPositionZ));
    setCamera(camera);

    // const controls = new OrbitControls(camera, figureElm.current.firstChild);
    // controls.update();

    // Light
    const light = new THREE.HemisphereLight( 0xffffff, 0x080820, 1 );
    scene.add( light );

    // Geometry
    const geometry = new THREE.DodecahedronGeometry( 6 );

    const resultCubeValue = [];
    const makeInstance = (geometry, color, x, y, z) => {
      const material = new THREE.MeshPhongMaterial({color: color});

      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      cube.position.x = x;
      cube.position.y = y;
      cube.position.z = z;

      resultCubeValue.push({
        uuid: cube.uuid,
        color: color,
        x: x,
        y: y,
        z: z
      });
      setCubeValue(resultCubeValue);

      return cube;
    };

    const getCubes = () => {
      const array = [];
      for (let i = 0; i < cubeValue.length; i++) {
        const color = cubeValue[i].color;
        const x = cubeValue[i].x;
        const y = cubeValue[i].y;
        const z = cubeValue[i].z;
        array.push(makeInstance(geometry, color, x, y, z));
      }
      return array;
    };


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

    const cubes = getCubes();
    const render = (time) => {
      time *= 0.0005;  // convert time to seconds

      cubes.forEach((cube, ndx) => {
        const speed = 1 + ndx * .1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;

        const positionZ = cube.position.z;

        if (positionZ > initCameraPositionZ) {
          cube.position.z = cubeValue[ndx].z;
        } else {
          cube.position.z = positionZ + 1;
        }
      });

      renderer.render(scene, camera);

      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);

  }, [canvasSize]);


  const getCanvasRelativePosition = (event) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * canvas.width  / rect.width,
      y: (event.clientY - rect.top ) * canvas.height / rect.height,
    };
  }

  const changeColor = (uuid, color, position) => {
    const resultCubeValue = cubeValue;
    for (let i = 0; i < resultCubeValue.length; i++){
      // @ts-ignore
      if (resultCubeValue[i].uuid === uuid) {
        resultCubeValue.splice( i, 1, {
          // @ts-ignore
          uuid: uuid,
          color: color,
          x: position.x,
          y: position.y,
          z: position.z
        });
      }
    }
    // console.log('resultCubeValue', resultCubeValue);
    setCubeValue(resultCubeValue);
  };

  const getPickPosition = (event) => {
    // console.log('event', event);
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
      const position = intersects[i].object.position;
      const hex = color.getHex();

      if (hex === cubeColors[1]) {
        color.set(cubeColors[0]);
        changeColor(uuid, cubeColors[0], position);
      } else if (hex === cubeColors[0]) {
        color.set(cubeColors[1]);
        changeColor(uuid, cubeColors[1], position);
      }
    }
  }


  // JSX
  return (
    <>
      <Figure ref={figureElm}
        onPointerDown={(event) => {
          setStartTime(event.timeStamp);
        }}
        onPointerUp={(event) => {
          setEndTime(event.timeStamp);
          const elapsedTime = event.timeStamp - startTime;
          setElapsedTime(elapsedTime);
          if (elapsedTime < 200) {
            getPickPosition(event);
          }
        }}
      ></Figure>
      <ul>
        <li>position.x: {positionX.toFixed(2)}</li>
        <li>position.y: {positionY.toFixed(2)}</li>
        <li>pickPosition.x: {pickPositionX.toFixed(2)}</li>
        <li>pickPosition.y: {pickPositionY.toFixed(2)}</li>
        <li>startTime: {startTime.toFixed(2)}</li>
        <li>endTime: {endTime.toFixed(2)}</li>
        <li>elapsedTime: {elapsedTime.toFixed(2)}</li>
        <li>canvas.width: {canvasSize}</li>
        <li>canvas.height: {canvasSize}</li>
      </ul>
    </>
  );
}

export default Inner;
