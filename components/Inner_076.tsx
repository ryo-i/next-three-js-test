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
    const radius = 1 // m


    // Create a sphere body
    const sphereMaterial1 = new CANNON.Material('sphere');
    const sphereBody1 = new CANNON.Body({
      mass: 5, // kg
      shape: new CANNON.Sphere(radius),
      material: sphereMaterial1
    });
    sphereBody1.position.set(-3, 10, 0); // m
    world.addBody(sphereBody1);


    const sphereMaterial2 = new CANNON.Material('sphere');
    const sphereBody2 = new CANNON.Body({
      mass: 5, // kg
      shape: new CANNON.Sphere(radius),
      material: sphereMaterial2
    });
    sphereBody2.position.set(0, 10, 0); // m
    world.addBody(sphereBody2);


    const sphereMaterial3 = new CANNON.Material('sphere');
    const sphereBody3 = new CANNON.Body({
      mass: 5, // kg
      shape: new CANNON.Sphere(radius),
      material: sphereMaterial3
    });
    sphereBody3.position.set(3, 10, 0); // m
    world.addBody(sphereBody3);


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
    const mat_ground1 = new CANNON.ContactMaterial(groundMaterial, sphereMaterial1, {
      friction: 0.0,
      restitution: 0.3
    });

    const mat_ground2 = new CANNON.ContactMaterial(groundMaterial, sphereMaterial2, {
      friction: 0.0,
      restitution: 0.5
    });

    const mat_ground3 = new CANNON.ContactMaterial(groundMaterial, sphereMaterial3, {
      friction: 0.0,
      restitution: 0.7
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
    camera.position.y = 10;
    camera.position.z = 25;

    const controls = new OrbitControls(camera, figureElm.current.firstChild);
    controls.target.set(0, 5, 0);
    controls.update();

    // Ground
    const planeGeo = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.MeshStandardMaterial({color: 0xFFFFFF});
    const planeMesh = new THREE.Mesh(planeGeo, planeMaterial);
    planeMesh.rotation.x = Math.PI * -.5;
    planeMesh.position.y = -5;
    planeMesh.receiveShadow = true;
    scene.add(planeMesh);

    // Sphere
    const sphereGgeometry = new THREE.SphereGeometry(radius);
    const sphereMat = new THREE.MeshStandardMaterial({color: 0xFF0000});

    const sphereMesh1 = new THREE.Mesh(sphereGgeometry, sphereMat);
    sphereMesh1.castShadow = true;
    sphereMesh1.receiveShadow = true;
    scene.add(sphereMesh1);

    const sphereMesh2 = new THREE.Mesh(sphereGgeometry, sphereMat);
    sphereMesh2.castShadow = true;
    sphereMesh2.receiveShadow = true;
    scene.add(sphereMesh2);

    const sphereMesh3 = new THREE.Mesh(sphereGgeometry, sphereMat);
    sphereMesh3.castShadow = true;
    sphereMesh3.receiveShadow = true;
    scene.add(sphereMesh3);

    // light
    const light = new THREE.DirectionalLight( 0xffffff, 1 );
    // light.position.x = 0.5;
    // light.target.position.x = -0.5;
    light.castShadow = true;
    light.shadow.mapSize.width = 512; // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 500; // default
    light.shadow.radius = 15;
    scene.add( light );

    function animate() {
      requestAnimationFrame( animate );

      world.fixedStep()

      sphereMesh1.position.copy(cannonVec3ToThree(sphereBody1.position));
      sphereMesh1.quaternion.copy(cannonQuaternionToThree(sphereBody1.quaternion));

      sphereMesh2.position.copy(cannonVec3ToThree(sphereBody2.position));
      sphereMesh2.quaternion.copy(cannonQuaternionToThree(sphereBody2.quaternion));

      sphereMesh3.position.copy(cannonVec3ToThree(sphereBody3.position));
      sphereMesh3.quaternion.copy(cannonQuaternionToThree(sphereBody3.quaternion));

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
