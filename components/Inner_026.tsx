import React, { useState, useEffect, useRef }  from 'react';
import styled from 'styled-components';
import * as THREE from 'three/src/Three';

// CSS in JS
const Figure = styled.figure`
  canvas {
    box-shadow: 0 0 15px 2px rgb(0 0 0 / 10%);
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

    const fov = 35;
    const aspect = canvasSize / canvasSize;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.z = 80;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( canvasSize, canvasSize );
    if (figureElm.current.firstChild) {
      figureElm.current.removeChild( figureElm.current.firstChild );
    }
    figureElm.current.appendChild( renderer.domElement );

    const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    scene.add( light );


    // Basic
    // @ts-ignore
    class CustomSinCurve1 extends THREE.Curve {　// ※TSエラーあり
      scale: number;
      t: number;

      constructor(scale) {
        super();
        this.scale = scale;
      }
      getPoint(t) {
        const tx = t * 3 - 1.5;
        const ty = Math.sin(2 * Math.PI * t);
        const tz = 0;
        return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
      }
    }

    const path1 = new CustomSinCurve1(4);

    const geometry1 = new THREE.TubeGeometry(
      // @ts-ignore
      path1, // CustomSinCurve ※TSエラーあり
      20, // ui: tubularSegments,
      1, // ui: radius,
      8, // ui: radialSegments,
      false // ui: closed
    );


    // Expansion
    // @ts-ignore
    class CustomSinCurve2 extends THREE.Curve {　// ※TSエラーあり
      scale: number;
      t: number;

      constructor(scale) {
        super();
        this.scale = scale;
      }
      getPoint(t) {
        const tx = t * 3 - 1.5;
        const ty = Math.sin(2 * Math.PI * t);
        const tz = 0;
        return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
      }
    }

    const path2 = new CustomSinCurve2(4);

    const geometry2 = new THREE.TubeGeometry(
      // @ts-ignore
      path2, // CustomSinCurve ※TSエラーあり
      40, // ui: tubularSegments,
      2, // ui: radius,
      18, // ui: radialSegments,
      false // ui: closed
    );


    // Custom
    // @ts-ignore
    class CustomSinCurve3 extends THREE.Curve {　// ※TSエラーあり
      scale: number;
      t: number;

      constructor(scale) {
        super();
        this.scale = scale;
      }
      getPoint(t) {
        const tx = t * 2.5 - 1.8;
        const ty = Math.sin(2.3 * Math.PI * t);
        const tz = 0;
        return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
      }
    }

    const path3 = new CustomSinCurve3(4);

    const geometry3 = new THREE.TubeGeometry(
      // @ts-ignore
      path3, // CustomSinCurve ※TSエラーあり
      15, // ui: tubularSegments,
      1, // ui: radius,
      3, // ui: radialSegments,
      false // ui: closed
    );


    function makeInstance(geometry, color, x) {
      const material = new THREE.MeshPhongMaterial({color});
      const primitive = new THREE.Mesh(geometry, material);

      scene.add(primitive);
      primitive.position.x = x;

      return primitive;
    }

    const primitives = [
      makeInstance(geometry1, 'green',  -15),
      makeInstance(geometry2, 'yellow', 0),
      makeInstance(geometry3, 'red',  15),
    ];

    function render(time) {
      time *= 0.0005;  // convert time to seconds

      primitives.forEach((primitive, ndx) => {
        const speed = 1 + ndx * .1;
        const rot = time * speed;
        primitive.rotation.x = rot;
        primitive.rotation.y = rot;
      });

      renderer.render(scene, camera);

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
    console.log('canvasSize', canvasSize)
  }, [canvasSize]);


  // JSX
  return (
    <Figure ref={figureElm}></Figure>
  );
}

export default Inner;
