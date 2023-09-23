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
    // const halfExtents = new CANNON.Vec3(size , size, size);
    const cannonshape = new CANNON.Sphere(size);


    // Create a Cannon body
    const cannonMaterial1 = new CANNON.Material('sphere');
    const cannonBody1 = new CANNON.Body({
      mass: 1, // kg
      shape: cannonshape,
      material: cannonMaterial1
    });
    cannonBody1.position.set(-3, 10, -10); // m
    cannonBody1.velocity.set(0, 0, 5); //角速度
    cannonBody1.angularDamping = 0.5; //減衰率
    world.addBody(cannonBody1);


    const cannonMaterial2 = new CANNON.Material('sphere');
    const cannonBody2 = new CANNON.Body({
      mass: 1, // kg
      shape: cannonshape,
      material: cannonMaterial2
    });
    cannonBody2.position.set(0, 10, -10); // m
    cannonBody2.velocity.set(0, 0, 5); //角速度
    cannonBody2.angularDamping = 0.5; //減衰率
    world.addBody(cannonBody2);


    const cannonMaterial3 = new CANNON.Material('sphere');
    const cannonBody3 = new CANNON.Body({
      mass: 1, // kg
      shape: cannonshape,
      material: cannonMaterial3
    });
    cannonBody3.position.set(3, 10, -10); // m
    cannonBody3.velocity.set(0, 0, 5); //角速度
    cannonBody3.angularDamping = 0.5; //減衰率
    world.addBody(cannonBody3);


    // Create a static plane for the ground
    const groundMaterial = new CANNON.Material('ground');
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({
      type: CANNON.Body.STATIC, // can also be achieved by setting the mass to 0
      shape: new CANNON.Plane(),
      material: groundMaterial
    });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0) // make it face up
    world.addBody(groundBody);


    // Create contact material behaviour
    const mat_ground1 = new CANNON.ContactMaterial(groundMaterial, cannonMaterial1, {
      friction: 0.001,
      restitution: 0.25
    });

    const mat_ground2 = new CANNON.ContactMaterial(groundMaterial, cannonMaterial2, {
      friction: 0.01,
      restitution: 0.25
    });

    const mat_ground3 = new CANNON.ContactMaterial(groundMaterial, cannonMaterial3, {
      friction: 1.0,
      restitution: 0.25
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
    // camera.position.x = -10;
    camera.position.y = 10;
    camera.position.z = 40;

    const controls = new OrbitControls(camera, figureElm.current.firstChild);
    controls.target.set(0, 5, 0);
    controls.update();

    // Ground
    const planeGeo = new THREE.PlaneGeometry(15, 30);
    const planeMaterial = new THREE.MeshStandardMaterial({color: 0xFFFFFF});
    const planeMesh = new THREE.Mesh(planeGeo, planeMaterial);
    planeMesh.receiveShadow = true;
    scene.add(planeMesh);

    // Object
    const threeGeometry = new THREE.SphereGeometry(size);
    const threeMaterial = new THREE.MeshStandardMaterial({color: 0xFF0000});

    const threeMesh1 = new THREE.Mesh(threeGeometry, threeMaterial);
    threeMesh1.castShadow = true;
    threeMesh1.receiveShadow = true;
    scene.add(threeMesh1);

    const threeMesh2 = new THREE.Mesh(threeGeometry, threeMaterial);
    threeMesh2.castShadow = true;
    threeMesh2.receiveShadow = true;
    scene.add(threeMesh2);

    const threeMesh3 = new THREE.Mesh(threeGeometry, threeMaterial);
    threeMesh3.castShadow = true;
    threeMesh3.receiveShadow = true;
    scene.add(threeMesh3);

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

      threeMesh1.position.copy(cannonVec3ToThree(cannonBody1.position));
      threeMesh1.quaternion.copy(cannonQuaternionToThree(cannonBody1.quaternion));

      threeMesh2.position.copy(cannonVec3ToThree(cannonBody2.position));
      threeMesh2.quaternion.copy(cannonQuaternionToThree(cannonBody2.quaternion));

      threeMesh3.position.copy(cannonVec3ToThree(cannonBody3.position));
      threeMesh3.quaternion.copy(cannonQuaternionToThree(cannonBody3.quaternion));

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
