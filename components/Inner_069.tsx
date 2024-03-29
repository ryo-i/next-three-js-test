import React, { useState, useEffect, useRef }  from 'react';
import styled, { keyframes } from 'styled-components';
import * as THREE from 'three/src/Three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as Tone from 'tone'

// CSS in JS
const flashing = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0.5;
  }
`;

const Figure = styled.figure`
  margin: 0;
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
  .number, .timer, .situation {
    position: absolute;
    font-weight: bold;
    width: 280px;
  }
  .number, .timer {
    margin: 0;
    line-height: 1em;
    color: #fff;
    top: 10px;
    pointer-events: none;
  }
  .number {
    text-align: center;
    left: 50%;
    transform: translateX(-50%);
  }
  .timer {
    left: 10px;
  }
  .situation {
    margin: 0;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    color: #fff200;
    text-align: center;
    .title {
      margin: 0 0 30px;
      line-height: 1em;
      font-size: 50px;
      font-weight: bold;
      pointer-events: none;
      @media(max-width: 600px) {
        font-size: 35px;
      }
    }
    .playButton, .settings {
      color: #fff;
      text-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    }
    .playButton {
      padding: 10px;
      font-size: 16px;
      background: rgba(255, 0, 0, 0.3);
      border: 1px solid #fff;
      border-radius: 5px;
      animation: ${flashing} 1.5s linear infinite;
      &:hover {
        cursor: pointer;
        opacity: 0.8;
      }
    }
    .settings {
      margin: 0 0 30px;
      font-size: 11px;
      font-weight: normal;
      dl {
        margin: 0;
        dt {
          font-weight: normal;
          ::after {
            content: none;
          }
        }
        dd {
          margin: 0 0 10px;
          input {
            width: 100%;
          }
        }
      }
    }
  }
  .controller {
    padding: 10px;
    background: #333;
    color: #fff;
    display: flex;
    .play,
    .reset,
    .sound {
      display: flex;
      align-items: center;
      &Button {
        margin: 0 10px 0 0;
        padding: 0;
        width: 24px;
        height: 24px;
        background: #666;
        border: none;
        border-radius: 50%;
        color: #fff;
        &.Off {
          color: #333;
        }
      }
    }
    .playButton,
    .resetButton {
      // font-size: 20px;
    }
    .soundButton {
      font-size: 16px;
    }
  }
  input[type='range'] {
    -webkit-appearance: none;
    appearance: none;
    outline: none;
    cursor: pointer;
    height: 4px;
    background: #aaa;
    border-radius: 2px;
    border: none;
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      height: 12px;
      width: 12px;
      background-color: #fff;
      border-radius: 50%;
      border: none;
    }
  }
  .fadein {
    animation: ${fadeIn} 0.5s linear;
  }
  .fadeout {
    opacity: 0;
    pointer-events: none;
    animation: ${fadeOut} 0.3s linear;
  }
`;

const Explanation = styled.section`
  margin: 10px 0 0;
`;


// Sound settings
const envelopes = {
  button: {
    attack: 0.1,
    decay: 0.5,
    sustain: 0.7,
    release: 2
  },
  hit: {
    attack: 0.1,
    decay: 1,
    sustain: 0.5,
    release: 20
  },
  bgm: {
    attack: 0.15,
    decay: 0.15,
    sustain: 0.15,
    release: 1.5
  }
};


const buttonSynth = new Tone.PolySynth();
buttonSynth.set({
  oscillator: { type: 'triangle' },
  envelope: envelopes.button
});
buttonSynth.toDestination();

const hitSynth = new Tone.PolySynth();
hitSynth.set({
  oscillator: { type: 'sine' },
  envelope: envelopes.hit
});
hitSynth.toDestination();

const bgmSynth = new Tone.PolySynth({
  maxPolyphony: 100
});
bgmSynth.set({
  oscillator: { type: 'sine' },
  envelope: envelopes.bgm
});
const bgmDelay = new Tone.FeedbackDelay('8n', 0.5);
const bgmPanner = new Tone.Panner();
bgmSynth.connect(bgmPanner);
bgmPanner.connect(bgmDelay);
bgmDelay.toDestination();


// Component
function Inner() {
  const figureElm = useRef(null);
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const objectColors = [0xffffff, 0xff0000];
  const initCameraPositionZ = 300;
  const blockNumbers =  [20, 40, 60, 80, 100];
  const minRandomNumbers = [-30, -40, -50, -60, -70];
  const maxRandomNumbers = [30, 40, 50, 60, 70];
  const titleTexts = ['Dodecahedron', 'Clear!'];
  const playButtonTexts = ['Game Start', 'Replay?'];
  const buttonTexts = ['On', 'Off'];
  const buttonIcons = ['▶︎', '⏸', '■', '♪'];
  const soundVolumes = [-60, 0];
  const pitchLength = 24;
  const melodyPitchs = [
    'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
    'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5',
    'C6'
  ];
  const bassPitchs = [
    'C1', 'C#1', 'D1', 'D#1', 'E1', 'F1', 'F#1', 'G1', 'G#1', 'A1', 'A#1', 'B1',
    'C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2',
    'C3'
  ];


  const getPitchNumber = (min, max, number) => {
    const range = max - min;
    const thisNumber = number - min;
    const perPitchNumber = range / pitchLength;
    const thisPitchNumber = Math.floor(thisNumber / perPitchNumber);
    return thisPitchNumber;
  }


  const getInitValue = (length, min, max) => {
    const array = [];

    for (let i = 0; i < length; i++) {
      const rundomNumber = () => Math.floor(Math.random() * (max - min + 1) + min);
      const xRundomNumber = rundomNumber();
      const yRundomNumber = rundomNumber();
      const zRundomNumber = rundomNumber();
      const pitchNumber = getPitchNumber(min, max, yRundomNumber);
      const melodyPitch = melodyPitchs[pitchNumber];
      const bassPitch = bassPitchs[pitchNumber];
      const pan = xRundomNumber / max;

      array.push(
        {
          uuid: 0,
          color: objectColors[0],
          x: xRundomNumber,
          y: yRundomNumber,
          z: zRundomNumber,
          melodyPitch: melodyPitch,
          bassPitch: bassPitch,
          pan: Number(pan.toFixed(1))
        }
      );
    }

    // console.log('getInitValue', array)
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
  const [startTime, setStartTime] = useState(0);
  const [blockNumber, setBlockNumber] =  useState(10);
  const [nextBlockNumber, setNextBlockNumber] =  useState(10);
  const [minRandomNumber, setMinRandomNumber] = useState(minRandomNumbers[0]);
  const [maxRandomNumber, setmaxRandomNumber] = useState(maxRandomNumbers[0]);
  const [objectValue, setObjectValue] = useState(null);
  const [hitNumber, setHitNumber] = useState(0);
  const [isPlay, setIsPlay] = useState(false);
  const [isClear, setIsClear] = useState(false);
  const [isReplay, setIsReplay] = useState(false);
  const [replayNumber, setReplayNumber] = useState(0);
  const [countTimer, setCountTimer] = useState(0);
  const [timerId, setTimerId] = useState(null);
  const [title, setTitle] = useState(titleTexts[0]);
  const [playButton, setPlayButton] = useState(playButtonTexts[0]);
  const [playText, setPlayText] = useState(buttonTexts[1]);
  const [resetText, setResetText] = useState(buttonTexts[0]);
  const [soundText, setSoundText] = useState(buttonTexts[1]);
  const [soundVolume, setSoundVolume] = useState(soundVolumes[0]);
  const [currentSoundVolume, setCurrentSoundVolume] = useState(soundVolumes[0]);
  const [rondomBgmNdx, setRondomBgmNdx] = useState(null);
  const [rondomBgmUuid, setRondomBgmUuid] = useState(null);


  useEffect(() => {
    const canvasElmWidth = figureElm.current.clientWidth;
    // console.log('canvasElmWidth(load)', canvasElmWidth);
    changeCanvasSize(canvasElmWidth);
    setObjectValue(getInitValue(blockNumber, minRandomNumber, maxRandomNumber));
  }, [0]);


  useEffect(() => {
    if (!canvasSize) return;

    // three.js
    const scene = new THREE.Scene();
    setScene(scene);
    {
      const color = 0x000000;
      const near = 200;
      const far = 300;
      scene.fog = new THREE.Fog(color, near, far);
    }

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
    const makeInstance = (geometry, objectValue) => {
      const material = new THREE.MeshPhongMaterial({color: objectValue.color});
      const object = new THREE.Mesh(geometry, material);
      scene.add(object);

      object.position.x = objectValue.x;
      object.position.y = objectValue.y;
      object.position.z = objectValue.z;

      resultObjectValue.push({
        uuid: object.uuid,
        color: objectValue.color,
        x: objectValue.x,
        y: objectValue.y,
        z: objectValue.z,
        melodyPitch: objectValue.melodyPitch,
        bassPitch: objectValue.bassPitch,
        pan: objectValue.pan
      });
      setObjectValue(resultObjectValue);

      return object;
    };

    const getObjects = () => {
      if (objects) return objects;

      const newObjects = [];
      for (let i = 0; i < objectValue.length; i++) {
        newObjects.push(makeInstance(geometry, objectValue[i]));
      }
      // console.log('newObjects', newObjects)
      return newObjects;
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

    // Animation
    const objects = getObjects();

    const render = (time) => {
      time *= 0.0005;  // convert time to seconds

      objects.forEach((object, ndx) => {
        const speed = 1 + ndx * .1;
        const rot = time * speed;
        object.rotation.x = rot;
        object.rotation.y = rot;

        const positionZ = object.position.z;
        const isCameraPositionZ = positionZ === initCameraPositionZ;
        if (isCameraPositionZ) {
          object.position.z = objectValue[ndx].z;
          setRondomBgmNdx(ndx);
          setRondomBgmUuid(object.uuid);
        } else {
          object.position.z = positionZ + 1;
        }
      });

      renderer.render(scene, camera);

      if (isReplay) setIsReplay(false);

      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);

  }, [canvasSize, replayNumber]);


  useEffect(() => {
    if (!isPlay || !isReplay) return;
    setReplayNumber(replayNumber + 1);
  }, [isReplay]);


  useEffect(() => {
    playRandomBGM(rondomBgmNdx, rondomBgmUuid);
  }, [rondomBgmNdx]);


  const soundStart = () => {
    if (Tone.context.state === 'suspended') {
      Tone.context.resume();
      Tone.start();
    }
  };


  const playStartSound = () => {
    if (soundText === buttonTexts[1]) return;
    const now = Tone.now();
    buttonSynth.triggerAttackRelease('C6', '8n', now, 0.6);
    buttonSynth.triggerAttackRelease('G5', '8n', now + 0.1, 0.8);
    buttonSynth.triggerAttackRelease('C5', '8n', now + 0.2, 1);
  }


  const playClearSound = () => {
    if (soundText === buttonTexts[1]) return;
    const now = Tone.now();
    buttonSynth.triggerAttackRelease('C5', '8n', now + 0.1, 0.6);
    buttonSynth.triggerAttackRelease('G5', '8n', now + 0.2, 0.8);
    buttonSynth.triggerAttackRelease('C6', '8n', now + 0.3, 1);
  }


  const playHitSound = (uuid, objectColor) => {
    if (soundText === buttonTexts[1]) return;
    let melodyPitch = '';
    let bassPitch = '';

    for (let i = 0; i < objectValue.length; i++){
      if (objectValue[i].uuid === uuid) {
        melodyPitch = objectValue[i].melodyPitch;
        bassPitch = objectValue[i].bassPitch;
      }
    }

    const now = Tone.now();
    if (objectColor === objectColors[0]) {
      hitSynth.triggerAttackRelease(bassPitch, '4n', now);
    } else if (objectColor === objectColors[1]) {
      hitSynth.triggerAttackRelease(melodyPitch, '4n', now);
    }
  }


  const playRandomBGM = (ndx, uuid) => {
    if (soundText === buttonTexts[1]) return;
    if (!objectValue || !objectValue[ndx]) return;
    if (uuid !== objectValue[ndx].uuid) return;

    const objectColor = objectValue[ndx].color;
    const melodyPitch = objectValue[ndx].melodyPitch;
    const bassPitch = objectValue[ndx].bassPitch;
    const currentPan = bgmPanner.pan.value;
    const nextPan = objectValue[ndx].pan;
    if (currentPan !== nextPan) {
      bgmPanner.pan.rampTo(nextPan, .1);
    }
    const now = Tone.now();

    if (objectColor === objectColors[0]) {
      bgmSynth.triggerAttackRelease(bassPitch, '64n', now);
    } else if (objectColor === objectColors[1]) {
      bgmSynth.triggerAttackRelease(melodyPitch, '64n', now);
      // console.log('melodyPitch', melodyPitch);
    }
  }

  const countUp = () => {
    let counter = 0;
    setTimerId(
      setInterval(() => {
      counter += 0.01;
      setCountTimer(counter);
      }, 10)
    );
  };


  const getCanvasRelativePosition = (event) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * canvas.width  / rect.width,
      y: (event.clientY - rect.top ) * canvas.height / rect.height,
    };
  };


  const getRedObjectValue = (objectValue) => {
    const result = objectValue.filter((objectValue) => {
      return objectValue.color === 16711680;
    });
    return result;
  }


  const changeColor = (uuid, color, position) => {
    const resultObjectValue = objectValue;
    for (let i = 0; i < resultObjectValue.length; i++){
      if (resultObjectValue[i].uuid === uuid) {
        resultObjectValue.splice( i, 1, {
          uuid: uuid,
          color: color,
          x: position.x,
          y: position.y,
          z: position.z,
          melodyPitch: resultObjectValue[i].melodyPitch,
          bassPitch: resultObjectValue[i].bassPitch,
          pan: resultObjectValue[i].pan
        });
      }
    }

    const redObjectValue = getRedObjectValue(resultObjectValue);
    if (redObjectValue.length === blockNumber) {
      clearInterval(timerId);
      setIsClear(true);
      setTitle(titleTexts[1]);
      setPlayButton(playButtonTexts[1]);
      playClearSound();
      setPlayText(buttonTexts[1]);
      setResetText(buttonTexts[0]);
    }

    setObjectValue(resultObjectValue);
    setHitNumber(redObjectValue.length);
  };


  const getPickPosition = (event) => {
    if (isClear || !isPlay) return;

    const pos = getCanvasRelativePosition(event);
    const pickPosition = {
      x: (pos.x / canvas.width ) *  2 - 1,
      y: (pos.y / canvas.height) * -2 + 1,
    };
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
        playHitSound(uuid, objectColors[0]);
      } else if (hex === objectColors[0]) {
        color.set(objectColors[1]);
        changeColor(uuid, objectColors[1], position);
        playHitSound(uuid, objectColors[1]);
      }
    }
  };


  const playStart = () => {
    setBlockNumber(nextBlockNumber);
    setObjectValue(getInitValue(nextBlockNumber, minRandomNumber, maxRandomNumber));
    // console.log('objectValue', objectValue);

    if (isClear) setIsClear(false);
    if (!isPlay) setIsPlay(true);
    if (!isReplay) setIsReplay(true);
    if (countTimer !== 0) setCountTimer(0);
    if (hitNumber !== 0) setHitNumber(0);

    countUp();
    playStartSound();
    setPlayText(buttonTexts[0]);
    setResetText(buttonTexts[1]);
  }


  const playReset = () => {
    clearInterval(timerId);
    setIsClear(true);
    setTitle(titleTexts[0]);
    setPlayButton(playButtonTexts[0]);
    playClearSound();
    setResetText(buttonTexts[0]);
    setCountTimer(0);
    setHitNumber(0);
    setPlayText(buttonTexts[1]);
    setResetText(buttonTexts[0]);
  }


  const toggleButton = (e: React.PointerEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;
    const getName: string = String(target.name);
    const getValue: string = String(target.value);

    switch (getName){
      case 'play':
        const isPlay = getValue === buttonTexts[0];
        if (isPlay) return;
        playStart();
        break;
      case 'reset':
        const isReset = getValue === buttonTexts[0];
        if (isReset) return;
        playReset();
        break;
      case 'sound':
        const isMute = getValue === buttonTexts[1];
        const isZero = currentSoundVolume === soundVolumes[0];
        if (!isMute) {
          setSoundText(buttonTexts[1]);
          setSoundVolume(soundVolumes[0]);
        } else if (!isZero) {
          setSoundText(buttonTexts[0]);
          setSoundVolume(currentSoundVolume);
        }
        break;
    }
  }


  const changeRange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const getName: string = String(e.target.name);
    const getValue: number = Number(e.target.value);

    switch (getName){
      case 'blockNumber':
        setNextBlockNumber(getValue);
        if (getValue <= blockNumbers[0]) {
          setMinRandomNumber(minRandomNumbers[0]);
          setmaxRandomNumber(maxRandomNumbers[0]);
        } else if (getValue <= blockNumbers[1]) {
          setMinRandomNumber(minRandomNumbers[1]);
          setmaxRandomNumber(maxRandomNumbers[1]);
        } else if (getValue <= blockNumbers[2]) {
          setMinRandomNumber(minRandomNumbers[2]);
          setmaxRandomNumber(maxRandomNumbers[2]);
        } else if (getValue <= blockNumbers[3]) {
          setMinRandomNumber(minRandomNumbers[3]);
          setmaxRandomNumber(maxRandomNumbers[3]);
        } else if (getValue <= blockNumbers[4]) {
          setMinRandomNumber(minRandomNumbers[4]);
          setmaxRandomNumber(maxRandomNumbers[4]);
        }
        break;
      case 'soundVolume':
        const isZero = getValue === soundVolumes[0];
        if (isZero) {
          setSoundText(buttonTexts[1]);
        } else {
          setSoundText(buttonTexts[0]);
        }

        setSoundVolume(getValue);
        setCurrentSoundVolume(getValue);
        buttonSynth.volume.value = getValue;
        hitSynth.volume.value = getValue;
        bgmSynth.volume.value = getValue;
        break;
    }
  };


  // JSX
  return (
    <>
      <Screen className="screen">
        <Figure ref={figureElm}
          onPointerDown={(event) => {
            setStartTime(event.timeStamp);
          }}
          onPointerUp={(event) => {
            const elapsedTime = event.timeStamp - startTime;
            if (elapsedTime < 200) {
              const redObjectValue = getRedObjectValue(objectValue);
              if (redObjectValue.length === blockNumber) {
                setIsClear(true);
              } else {
                getPickPosition(event);
              }
            }
          }}
        >
        </Figure>
        {canvas && <>
          <p className="number">{hitNumber} / {blockNumber}</p>
          <p className="timer">{countTimer.toFixed(2)}</p>
          <section className={'situation ' + ((!isPlay || isClear) ? 'fadein' : 'fadeout')}>
            <h2 className="title">{title}</h2>
            <div className="settings">
              <dl>
                <dt>Blocks: {nextBlockNumber}</dt>
                <dd><input type="range" name="blockNumber" min="10" max="50" step="10" value={nextBlockNumber} onChange={changeRange} /></dd>
              </dl>
              <dl>
                <dt>Sound:</dt>
                <dd><input type="range" name="soundVolume" min={soundVolumes[0]} max={soundVolumes[1]} step="1" value={soundVolume} onChange={changeRange} onPointerDown={soundStart} /></dd>
              </dl>
            </div>
            <button className="playButton" onPointerDown={playStart}>{playButton}</button>
          </section>
          <div className="controller">
            <div className="player">
              <button type="button" name="play" value={playText} className={'playButton ' + playText} onPointerDown={(e) => toggleButton(e)}>{buttonIcons[0]}</button>
              <button type="button" name="reset" value={resetText} className={'resetButton ' + resetText} onPointerDown={(e) => toggleButton(e)}>{buttonIcons[2]}</button>
            </div>
            <div className="sound">
              <button type="button" name="sound" value={soundText} className={'soundButton ' + soundText} onPointerDown={(e) => toggleButton(e)}>{buttonIcons[3]}</button>
              <input type="range" name="soundVolume" min={soundVolumes[0]} max={soundVolumes[1]} step="1" value={soundVolume} onChange={changeRange} onPointerDown={soundStart} />
            </div>
          </div>
        </>}
      </Screen>
      {canvas && <Explanation>
        <h2>遊び方</h2>
        <ul>
          <li>ランダムに配置された白い岩が迫ってきます</li>
          <li>岩を撃つと赤くなります（赤い岩を撃つと白に戻ってしまいます）</li>
          <li>全ての岩が赤くなったらゲームクリアです</li>
          <li>Blocksで岩の数を変更できます</li>
          <li>Soundで音量を変えるとランダムなメロディが再生されます</li>
        </ul>
        <hr />
      </Explanation>}
    </>
  );
}

export default Inner;