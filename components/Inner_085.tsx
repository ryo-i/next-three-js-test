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

const Frame = styled.div`
position: relative;
    .addBtn {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0,0,0,0.6);
      color: #fff;
      font-size: 20px;
      border: 1px solid #fff;
      border-radius: 10px;
      padding: 10px 20px;
    }
`;


// Casting function
const cannonVec3ToThree = (vec3) => {
  return new THREE.Vector3(vec3.x, vec3.y, vec3.z);
};

const cannonQuaternionToThree = (quaternion) => {
  return new THREE.Quaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}


// Component
function Inner() {
  const [canvasSize, setCanvasSize] = useState(0);
  const figureElm = useRef(null);
  const [cannonBodies, setCannonBodies] = useState([]);
  const [threeMeshes, setThreeMeshes] = useState([]);

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
    // camera.position.x = 10;
    camera.position.y = 7;
    camera.position.z = 40;

    const controls = new OrbitControls(camera, figureElm.current.firstChild);
    controls.target.set(0, 5, 0);
    controls.update();

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

    // Ground
    const planeGeo = new THREE.PlaneGeometry(20, 30);
    const planeMaterial = new THREE.MeshStandardMaterial({color: 0xFFFFFF});
    const planeMesh = new THREE.Mesh(planeGeo, planeMaterial);
    planeMesh.receiveShadow = true;
    scene.add(planeMesh);

    const cannonMaterial = new CANNON.Material('sphere');
    // Create contact material behaviour
    const mat_ground = new CANNON.ContactMaterial(groundMaterial, cannonMaterial, {
      friction: 0.001,
      restitution: 0.25
    });
    world.addContactMaterial(mat_ground);

    const addObject = () => {
       // Create a Cannon body
      const cannonBody = new CANNON.Body({
        mass: 1, // kg
        shape: cannonshape,
        material: cannonMaterial
      });

      const positionX = getRandomInt(-5, 5);
      const positionY = 15;
      const positionZ = getRandomInt(-5, 5);

      cannonBody.position.set(positionX, positionY, positionZ); // m
      cannonBody.velocity.set(0, 0, 0); //角速度
      cannonBody.angularDamping = 0.5; //減衰率
      world.addBody(cannonBody);

      let bodyArray = cannonBodies;
      bodyArray.push(cannonBody);
      setCannonBodies(bodyArray);

      // Object
      const threeGeometry = new THREE.SphereGeometry(size);
      const threeMaterial = new THREE.MeshStandardMaterial({color: 0xFF0000});

      const threeMesh = new THREE.Mesh(threeGeometry, threeMaterial);
      threeMesh.castShadow = true;
      threeMesh.receiveShadow = true;
      scene.add(threeMesh);

      let meshArray = threeMeshes;
      meshArray.push(threeMesh);
      setThreeMeshes(meshArray);
    };

    const addBtn = document.querySelector('.addBtn');
    addBtn.addEventListener('click', addObject);

    function animate() {
      requestAnimationFrame( animate );

      world.fixedStep()

      if (threeMeshes) {
        for (let i = 0; i < threeMeshes.length; i++) {
          threeMeshes[i].position.copy(cannonVec3ToThree(cannonBodies[i].position));
          threeMeshes[i].quaternion.copy(cannonQuaternionToThree(cannonBodies[i].quaternion));
        }
      }

      planeMesh.position.copy(cannonVec3ToThree(groundBody.position));
      planeMesh.quaternion.copy(cannonQuaternionToThree(groundBody.quaternion));

      renderer.render( scene, camera );
    };

    animate();
  }, [canvasSize]);

  // JSX
  return (
    <Frame className="frame">
      <Figure ref={figureElm}></Figure>
      <button className="addBtn">追加</button>
    </Frame>
  );
}

export default Inner;
