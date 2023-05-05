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
  text-shadow: 0 0 20px rgba(0,0,0,0.2);
  .number, .situation {
    position: absolute;
    font-weight: bold;
  }
  .number {
    margin: 0;
    line-height: 1em;
    color: #fff;
    top: 10px;
    left: 10px;
    pointer-events: none;
  }
  .situation {
    margin: 0;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    color: #fff200;
    text-align: center;
    .title {
      margin: 0 0 15px;
      line-height: 1em;
      font-size: 35px;
      font-weight: bold;

      pointer-events: none;
    }
    .play {
      padding: 5px;
      color: #fff;
      text-shadow: 0 0 5px rgba(0,0,0,0.2);
      background: rgba(255,255,255,0.3);
      border: 1px solid #fff;
      border-radius: 5px;
      animation: flashing 1.5s linear infinite;
      &:hover {
        cursor: pointer;
        opacity: 0.8;
      }
    }
  }
  @keyframes flashing {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
  }
`;


// Component
function Inner() {
  const figureElm = useRef(null);
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const objectColors = [0xffffff, 0xff0000];
  const initCameraPositionZ = 300;
  const toralNumber = 20;
  const minRandomNumber = -30;
  const maxrandomNumber = 30;


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
  const [objectValue, setObjectValue] = useState(getInitColorValue(toralNumber, minRandomNumber, maxrandomNumber));
  const [hitNumber, setHitNumber] = useState(0);
  const [isPlay, setIsPlay] = useState(false);
  const [isClear, setIsClear] = useState(false);
  const [isReplay, setIsReplay] = useState(false);


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

      if (isReplay) setIsReplay(false);

      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);

  }, [canvasSize, isReplay, isPlay]);


  const getCanvasRelativePosition = (event) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * canvas.width  / rect.width,
      y: (event.clientY - rect.top ) * canvas.height / rect.height,
    };
  };


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

    let redObjectValue = resultObjectValue.filter((objectValue) => {
      return objectValue.color === 16711680;
    });

    if (redObjectValue.length === toralNumber) {
      setIsClear(true);
    }

    setObjectValue(resultObjectValue);
    setHitNumber(redObjectValue.length);
  };


  const getPickPosition = (event) => {
    if (isClear || !isPlay) return;

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
      } else if (hex === objectColors[0]) {
        color.set(objectColors[1]);
        changeColor(uuid, objectColors[1], position);
      }
    }
  };


  const doPlay = () => {
    setObjectValue(getInitColorValue(toralNumber, minRandomNumber, maxrandomNumber));
    if (isClear) setIsClear(false);
    if (!isPlay) setIsPlay(true);
    if (!isReplay) setIsReplay(true);
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
      <section className="situation">
        { !isPlay &&
          <>
            <h2 className="title">Dodecaheron</h2>
            <button className="play" onPointerDown={doPlay}>Game Start</button>
          </>
        } { isClear &&
          <>
            <h2 className="title">CLEAR!</h2>
            <button className="play" onPointerDown={doPlay}>Replay?</button>
          </>
        }
      </section>
    </Screen>
  );
}

export default Inner;
