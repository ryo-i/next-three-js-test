import React, { useState, useEffect, useRef }  from 'react';
import styled from 'styled-components';
import * as THREE from 'three/src/Three';
import * as CANNON from 'cannon-es'


// CSS in JS
const Figure = styled.figure`
  canvas {
    box-shadow: 0 0 15px 2px rgb(0 0 0 / 10%);
  }
`;

// Component
function Inner() {
  // cannon-es
  // Setup our physics world
  const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
  })

  // Create a sphere body
  const radius = 1 // m
  const sphereBody = new CANNON.Body({
    mass: 5, // kg
    shape: new CANNON.Sphere(radius),
  })
  sphereBody.position.set(0, 10, 0) // m
  world.addBody(sphereBody)

  // Create a static plane for the ground
  const groundBody = new CANNON.Body({
    type: CANNON.Body.STATIC, // can also be achieved by setting the mass to 0
    shape: new CANNON.Plane(),
  })
  groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0) // make it face up
  world.addBody(groundBody)

  // Start the simulation loop
  function animate() {
    requestAnimationFrame(animate)

    world.fixedStep()

    // the sphere y position shows the sphere falling
    console.log(`Sphere y position: ${sphereBody.position.y}`)
  }
  animate()


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


  // three.js
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 35, canvasSize / canvasSize, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( canvasSize, canvasSize );

    if (figureElm.current.firstChild) {
      figureElm.current.removeChild( figureElm.current.firstChild );
    }
    figureElm.current.appendChild( renderer.domElement );

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshStandardMaterial( { color: 0xff0000 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    camera.position.z = 5;

    const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    scene.add( light );

    function animate() {
      requestAnimationFrame( animate );

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render( scene, camera );
    };

    animate();
  }, [canvasSize]);

  // JSX
  return (
    <Figure ref={figureElm}></Figure>
  );
}

export default Inner;
