import React, { useState, useEffect, useRef }  from 'react';
import styled from 'styled-components';
import * as THREE from 'three/src/Three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// CSS in JS
const Figure = styled.figure`
  canvas {
    box-shadow: 0 0 15px 2px rgb(0 0 0 / 10%);
  }
  .screen {
    position: relative;

    .number {
      position: absolute;
      color: red;
    }

  }
`;

const Screen = styled.div`
  position: relative;
  .number {
    position: absolute;
    font-weight: bold;
    color: #fff;
    top: 10px;
    left: 10px;
    margin: 0;
    line-height: 1em;
    pointer-events: none;
  }
`;


// Component
function Inner() {
  const figureElm = useRef(null);
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const objectColors = [0xffffff, 0xff0000];
  const initCameraPositionZ = 300;


  const getInitColorValue = (length, min, max) => {
    const array = [];
    for (let i = 0; i < length; i++) {
      const rundomNumber = () => Math.floor(Math.random() * (max - min + 1) + min);
      array.push(
        {
          uuid: 0,
          color: objectColors[0],
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
  const [objectValue, setObjectValue] = useState(getInitColorValue(20, -30, 30));
  const [toralNumber, setTotalNumber] = useState(20);
  const [hitNumber, setHitNumber] = useState(0);


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

    const resultObjectValue = [];
    const makeInstance = (geometry, color, x, y, z) => {
      const material = new THREE.MeshPhongMaterial({color: color});

      const object = new THREE.Mesh(geometry, material);
      scene.add(object);

      object.position.x = x;
      object.position.y = y;
      object.position.z = z;

      resultObjectValue.push({
        uuid: object.uuid,
        color: color,
        x: x,
        y: y,
        z: z
      });
      setObjectValue(resultObjectValue);

      return object;
    };

    const getObjects = () => {
      const array = [];
      for (let i = 0; i < objectValue.length; i++) {
        const color = objectValue[i].color;
        const x = objectValue[i].x;
        const y = objectValue[i].y;
        const z = objectValue[i].z;
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

    const objects = getObjects();
    const render = (time) => {
      time *= 0.0005;  // convert time to seconds

      objects.forEach((object, ndx) => {
        const speed = 1 + ndx * .1;
        const rot = time * speed;
        object.rotation.x = rot;
        object.rotation.y = rot;

        const positionZ = object.position.z;

        if (positionZ > initCameraPositionZ) {
          object.position.z = objectValue[ndx].z;
        } else {
          object.position.z = positionZ + 1;
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
    const resultObjectValue = objectValue;
    for (let i = 0; i < resultObjectValue.length; i++){
      // @ts-ignore
      if (resultObjectValue[i].uuid === uuid) {
        resultObjectValue.splice( i, 1, {
          // @ts-ignore
          uuid: uuid,
          color: color,
          x: position.x,
          y: position.y,
          z: position.z
        });
      }
    }
    // console.log('resultObjectValue', resultObjectValue);
    setObjectValue(resultObjectValue);
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

      if (hex === objectColors[1]) {
        color.set(objectColors[0]);
        changeColor(uuid, objectColors[0], position);
        setHitNumber(hitNumber - 1);
      } else if (hex === objectColors[0]) {
        color.set(objectColors[1]);
        changeColor(uuid, objectColors[1], position);
        setHitNumber(hitNumber + 1);
      }
    }
  }


  // JSX
  return (
    <Screen className="screen">
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
      >
      </Figure>
      <p className="number">{hitNumber} / {toralNumber}</p>
    </Screen>
  );
}

export default Inner;
