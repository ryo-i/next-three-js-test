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


// Casting function
const cannonVec3ToThree = (vec3) => {
  return new THREE.Vector3(vec3.x, vec3.y, vec3.z);
};

const cannonQuaternionToThree = (quaternion) => {
  return new THREE.Quaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
};


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
    console.log('sphereBody', sphereBody.position)
    console.log('sphereBody', sphereBody.quaternion)

    // Create a static plane for the ground
    const groundBody = new CANNON.Body({
      type: CANNON.Body.STATIC, // can also be achieved by setting the mass to 0
      shape: new CANNON.Plane(),
    })
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0) // make it face up
    world.addBody(groundBody)


    // three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 35, canvasSize / canvasSize, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( canvasSize, canvasSize );

    if (figureElm.current.firstChild) {
      figureElm.current.removeChild( figureElm.current.firstChild );
    }
    figureElm.current.appendChild( renderer.domElement );

    const geometry = new THREE.SphereGeometry(radius)
    const material = new THREE.MeshNormalMaterial()
    const sphereMesh = new THREE.Mesh(geometry, material)
    scene.add(sphereMesh)

    camera.position.y = 5;
    camera.position.z = 20;

    const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    scene.add( light );

    function animate() {
      requestAnimationFrame( animate );

      world.fixedStep()

      sphereMesh.position.copy(cannonVec3ToThree(sphereBody.position));
      sphereMesh.quaternion.copy(cannonQuaternionToThree(sphereBody.quaternion));

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
