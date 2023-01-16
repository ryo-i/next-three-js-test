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

    const x = -2.5;
    const y = -5;

    // Basic
    const shape1 = new THREE.Shape();
    shape1.moveTo(x + 2.5, y + 2.5);
    shape1.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
    shape1.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
    shape1.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
    shape1.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
    shape1.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
    shape1.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);
    const geometry1 = new THREE.ShapeGeometry(shape1);


    // Expansion
    const shape2 = new THREE.Shape();
    shape2.moveTo(x + 2.5, y + 2.5);
    shape2.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
    shape2.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
    shape2.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
    shape2.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
    shape2.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
    shape2.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);
    const geometry2 = new THREE.ShapeGeometry(
      shape2,
      5 // ui: curveSegments
    );


    // Custom
    const shape3BezierCurveTo = () => {
      const array = [];
      const verticesOfshape3ValurMax = 9.5;
      const verticesOfshape3ValurMin = -9.5;

      for (let i = 0; i < 6; i++) {
        let value = 0;
        if( i % 2 == 0 ) {
          value = x;
        } else {
          value = y;
        }
        const rundomNum = Math.floor(Math.random() * (verticesOfshape3ValurMax - verticesOfshape3ValurMin + 1) + verticesOfshape3ValurMin);
        // console.log('x, x', x, y);
        // console.log('value', value);
        // console.log('rundomNum', rundomNum);
        // console.log('rundomNum + value', rundomNum + value);

        array.push(
          value + rundomNum
        );
      }

      console.log('array', array);
      shape3.bezierCurveTo(
        array[0],
        array[1],
        array[2],
        array[3],
        array[4],
        array[5]
      );
    };

    const shape3 = new THREE.Shape();
    shape3.moveTo(x + 2.5, y + 2.5);
    shape3BezierCurveTo();
    shape3BezierCurveTo();
    shape3BezierCurveTo();
    shape3BezierCurveTo();
    shape3BezierCurveTo();
    shape3BezierCurveTo();
    const geometry3 = new THREE.ShapeGeometry(
      shape3,
      8 // ui: curveSegments
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
