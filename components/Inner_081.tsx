import React, { useState, useEffect, useRef }  from 'react';
import styled from 'styled-components';
import * as THREE from 'three/src/Three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
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
    });

    const size = 1;
    const halfExtents = new CANNON.Vec3(size , size, size);


    // Create a box body
    const boxMaterial1 = new CANNON.Material('box');
    const boxBody1 = new CANNON.Body({
      mass: 1, // kg
      shape: new CANNON.Box(halfExtents),
      material: boxMaterial1
    });
    boxBody1.position.set(-3, 10, -3); // m
    boxBody1.velocity.set(0, 0, 0); //角速度
    boxBody1.angularDamping = 0.01; //減衰率
    world.addBody(boxBody1);


    const boxMaterial2 = new CANNON.Material('box');
    const boxBody2 = new CANNON.Body({
      mass: 1, // kg
      shape: new CANNON.Box(halfExtents),
      material: boxMaterial2
    });
    boxBody2.position.set(0, 10, -3); // m
    boxBody2.velocity.set(0, 0, 0); //角速度
    boxBody2.angularDamping = 0.5; //減衰率
    world.addBody(boxBody2);


    const boxMaterial3 = new CANNON.Material('box');
    const boxBody3 = new CANNON.Body({
      mass: 1, // kg
      shape: new CANNON.Box(halfExtents),
      material: boxMaterial3
    });
    boxBody3.position.set(3, 10, -3); // m
    boxBody3.velocity.set(0, 0, 0); //角速度
    boxBody3.angularDamping = 0.99; //減衰率
    world.addBody(boxBody3);


    // Create a static plane for the ground
    const groundMaterial = new CANNON.Material('ground');
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({
      type: CANNON.Body.STATIC, // can also be achieved by setting the mass to 0
      shape: new CANNON.Plane(),
      material: groundMaterial
    });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromEuler(-Math.PI / 2.2, 0, 0) // make it face up
    world.addBody(groundBody);


    // Create contact material behaviour
    const mat_ground1 = new CANNON.ContactMaterial(groundMaterial, boxMaterial1, {
      friction: 0.0,
      restitution: 0.8
    });

    const mat_ground2 = new CANNON.ContactMaterial(groundMaterial, boxMaterial2, {
      friction: 0.0,
      restitution: 0.8
    });

    const mat_ground3 = new CANNON.ContactMaterial(groundMaterial, boxMaterial3, {
      friction: 0.0,
      restitution: 0.8
    });

    world.addContactMaterial(mat_ground1);
    world.addContactMaterial(mat_ground2);
    world.addContactMaterial(mat_ground3);


    // three.js
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x555555);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( canvasSize, canvasSize );
    renderer.shadowMap.enabled = true;

    if (figureElm.current.firstChild) {
      figureElm.current.removeChild( figureElm.current.firstChild );
    }
    figureElm.current.appendChild( renderer.domElement );

    const fov = 35;
    const aspect = canvasSize / canvasSize;
    const near = 0.1;
    const far = 500;
    const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.x = 10;
    camera.position.y = 10;
    camera.position.z = 25;

    const controls = new OrbitControls(camera, figureElm.current.firstChild);
    controls.target.set(0, 5, 0);
    controls.update();

    // Ground
    const planeGeo = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.MeshStandardMaterial({color: 0xFFFFFF});
    const planeMesh = new THREE.Mesh(planeGeo, planeMaterial);
    planeMesh.receiveShadow = true;
    scene.add(planeMesh);

    // Box
    const boxGeometry = new THREE.BoxGeometry(size * 2, size * 2, size * 2);
    const boxMat = new THREE.MeshStandardMaterial({color: 0xFF0000});

    const boxMesh1 = new THREE.Mesh(boxGeometry, boxMat);
    boxMesh1.castShadow = true;
    boxMesh1.receiveShadow = true;
    scene.add(boxMesh1);

    const boxMesh2 = new THREE.Mesh(boxGeometry, boxMat);
    boxMesh2.castShadow = true;
    boxMesh2.receiveShadow = true;
    scene.add(boxMesh2);

    const boxMesh3 = new THREE.Mesh(boxGeometry, boxMat);
    boxMesh3.castShadow = true;
    boxMesh3.receiveShadow = true;
    scene.add(boxMesh3);

    // light
    const light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.y = 3;
    light.castShadow = true;
    light.shadow.mapSize.width = 512; // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 500; // default
    light.shadow.camera.zoom = 0.15;
    // light.shadow.radius = 10;
    scene.add( light );

    function animate() {
      requestAnimationFrame( animate );

      world.fixedStep()

      boxMesh1.position.copy(cannonVec3ToThree(boxBody1.position));
      boxMesh1.quaternion.copy(cannonQuaternionToThree(boxBody1.quaternion));

      boxMesh2.position.copy(cannonVec3ToThree(boxBody2.position));
      boxMesh2.quaternion.copy(cannonQuaternionToThree(boxBody2.quaternion));

      boxMesh3.position.copy(cannonVec3ToThree(boxBody3.position));
      boxMesh3.quaternion.copy(cannonQuaternionToThree(boxBody3.quaternion));

      planeMesh.position.copy(cannonVec3ToThree(groundBody.position));
      planeMesh.quaternion.copy(cannonQuaternionToThree(groundBody.quaternion));

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
