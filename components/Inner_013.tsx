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

    const extrudeSettings1 = {
      steps: 2,  // ui: steps
      depth: 2,  // ui: depth
      bevelEnabled: true,  // ui: bevelEnabled
      bevelThickness: 1,  // ui: bevelThickness
      bevelSize: 1,  // ui: bevelSize
      bevelSegments: 2,  // ui: bevelSegments
    };

    const geometry1 = new THREE.ExtrudeGeometry(shape1, extrudeSettings1);


    // Expansion
    const outline2 = new THREE.Shape([
      [ -2, -0.1], [  2, -0.1], [ 2,  0.6],
      [1.6,  0.6], [1.6,  0.1], [-2,  0.1],
    ].map(p => new THREE.Vector2(...p)));

    const shape2: THREE.CurvePath<THREE.Vector> = new THREE.CurvePath();
    const points2: THREE.Vector3[] = [
      [x + 2.5, y + 2.5],
      [x + 2.5, y + 2.5], [x + 2,   y      ], [x,       y      ],
      [x - 3,   y      ], [x - 3,   y + 3.5], [x - 3,   y + 3.5],
      [x - 3,   y + 5.5], [x - 1.5, y + 7.7], [x + 2.5, y + 9.5],
      [x + 6,   y + 7.7], [x + 8,   y + 4.5], [x + 8,   y + 3.5],
      [x + 8,   y + 3.5], [x + 8,   y      ], [x + 5,   y      ],
      [x + 3.5, y      ], [x + 2.5, y + 2.5], [x + 2.5, y + 2.5],
    ].map(p => new THREE.Vector3(...p, 0));

    for (let i = 0; i < points2.length; i += 3) {
      const slicePoints: THREE.Vector3[] = points2.slice(i, i + 4);
      shape2.add(new THREE.CubicBezierCurve3(
        slicePoints[0], // starting point
        slicePoints[1], // first control point
        slicePoints[2], // second control point
        slicePoints[3], // ending point
        // ...points.slice(i, i + 4) // TS error: 2556
      ));
    }

    const extrudeSettings2: {
      steps: number;
      bevelEnabled: boolean;
      extrudePath: any;
      // extrudePath: THREE.CurvePath<THREE.Vector>; // TS error: 2345
    } = {
      steps: 100,  // ui: steps
      bevelEnabled: false,
      extrudePath: shape2,
    };

    const geometry2 =  new THREE.ExtrudeGeometry(outline2, extrudeSettings2);


    // Custom
    const getArray = (x, y, length, minValue, maxValue) => {
      const array = [];
      const min = Math.ceil(minValue);
      const max = Math.floor(maxValue);

      for (let i = 0; i < length; i++) {
        array.push([
          x + Math.floor(Math.random() * (max - min) + min),
          y + Math.floor(Math.random() * (max - min) + min)
        ]);
      }

      return array;
    }

    const outlineArray3 = getArray(0, 0, 6, -3, 3);
    console.log('outlineArray3', outlineArray3);
    const outline3 = new THREE.Shape(outlineArray3.map(p => new THREE.Vector2(...p)));

    const shapeArray3 = getArray(x, y, 19, -10, 10);
    console.log('shapeArray3', shapeArray3);
    const shape3: THREE.CurvePath<THREE.Vector> = new THREE.CurvePath();
    const points3: THREE.Vector3[] = shapeArray3.map(p => new THREE.Vector3(...p, 0));

    for (let i = 0; i < points3.length; i += 3) {
      const slicePoints: THREE.Vector3[] = points3.slice(i, i + 4);
      shape3.add(new THREE.CubicBezierCurve3(
        slicePoints[0], // starting point
        slicePoints[1], // first control point
        slicePoints[2], // second control point
        slicePoints[3], // ending point
        // ...points.slice(i, i + 4) // TS error: 2556
      ));
    }

    const extrudeSettings3: {
      steps: number;
      bevelEnabled: boolean;
      extrudePath: any;
      // extrudePath: THREE.CurvePath<THREE.Vector>; // TS error: 2345
    } = {
      steps: 100,  // ui: steps
      bevelEnabled: false,
      extrudePath: shape2,
    };

    const geometry3 =  new THREE.ExtrudeGeometry(outline3, extrudeSettings3);


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

  }, [canvasSize]);


  // JSX
  return (
    <Figure ref={figureElm}></Figure>
  );
}

export default Inner;
