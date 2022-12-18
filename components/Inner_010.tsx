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
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( canvasSize, canvasSize );
    if (figureElm.current.firstChild) {
      figureElm.current.removeChild( figureElm.current.firstChild );
    }
    figureElm.current.appendChild( renderer.domElement );

    const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    scene.add( light );

    const gParams = {
      basic: {
        radius: 0.8,
        height: 2,
        radialSegments: 16
      },
      expansion: {
        radius: 0.8,
        height: 2,
        radialSegments: 16,
        heightSegments: 2,
        openEnded :true,
        thetaStart: Math.PI * 0.25,
        thetaLength: Math.PI * 1.5
      },
      custom: {
        radius: 0.8,
        height: 2,
        radialSegments: 23,
        heightSegments: 5,
        openEnded :false,
        thetaStart: Math.PI * 0.46,
        thetaLength: Math.PI * 17
      }
    };

    const geometry1 = new THREE.ConeGeometry(
      gParams.basic.radius,
      gParams.basic.height,
      gParams.basic.radialSegments
    );

    const geometry2 = new THREE.ConeGeometry(
      gParams.expansion.radius,
      gParams.expansion.height,
      gParams.expansion.radialSegments,
      gParams.expansion.heightSegments,
      gParams.expansion.openEnded,
      gParams.expansion.thetaStart,
      gParams.expansion.thetaLength,
    );

    const geometry3 = new THREE.ConeGeometry(
      gParams.custom.radius,
      gParams.custom.height,
      gParams.custom.radialSegments,
      gParams.custom.heightSegments,
      gParams.custom.openEnded,
      gParams.custom.thetaStart,
      gParams.custom.thetaLength,
    );

    function makeInstance(geometry, color, x) {
      const material = new THREE.MeshPhongMaterial({color});
      const primitive = new THREE.Mesh(geometry, material);

      scene.add(primitive);
      primitive.position.x = x;

      return primitive;
    }

    const primitives = [
      makeInstance(geometry1, 'green',  -2),
      makeInstance(geometry2, 'yellow', 0),
      makeInstance(geometry3, 'red',  2),
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
