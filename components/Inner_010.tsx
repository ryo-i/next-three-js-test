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
    // three.js
    const scene = new THREE.Scene();

    const fov = 35;
    const aspect = canvasSize / canvasSize;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.z = 70;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( canvasSize, canvasSize );
    if (figureElm.current.firstChild) {
      figureElm.current.removeChild( figureElm.current.firstChild );
    }
    figureElm.current.appendChild( renderer.domElement );

    const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    scene.add( light );

    // basic
    const geometry1 = new THREE.ConeGeometry(
      6,// radius
      8, // height
      16 // radialSegments
    );

    // expansion
    const geometry2 = new THREE.ConeGeometry(
      6, // radius
      8, // height
      16, // radialSegments
      2,// heightSegments
      true, // openEnded
      Math.PI * 0.25, // thetaStart
      Math.PI * 1.5// thetaLength
    );

    // custom
    const geometry3 = new THREE.ConeGeometry(
      6, // radius
      8, // height
      23, // radialSegments
      5, // heightSegments
      false, // openEnded
      Math.PI * 0.46, // thetaStart
      Math.PI * 17 // thetaLength
    );

    function makeInstance(geometry, color, x) {
      const material = new THREE.MeshPhongMaterial({color});
      const primitive = new THREE.Mesh(geometry, material);

      scene.add(primitive);
      primitive.position.x = x;

      return primitive;
    }

    const primitives = [
      makeInstance(geometry1, 'green',  -13),
      makeInstance(geometry2, 'yellow', 0),
      makeInstance(geometry3, 'red',  13),
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

  }, [canvasSize]);


  // JSX
  return (
    <Figure ref={figureElm}></Figure>
  );
}

export default Inner;
