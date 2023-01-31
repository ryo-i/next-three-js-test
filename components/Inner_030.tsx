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
    const camera = new THREE.PerspectiveCamera( 35, canvasSize / canvasSize, 0.1, 1000 );
    camera.position.set(0, 50, 0);
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( canvasSize, canvasSize );

    if (figureElm.current.firstChild) {
      figureElm.current.removeChild( figureElm.current.firstChild );
    }
    figureElm.current.appendChild( renderer.domElement );

    // an array of objects whose rotation to update
    const objects = [];


    // use just one sphere for everything
    const radius = 1;
    const widthSegments = 8;
    const heightSegments = 8;
    const sphereGeometry = new THREE.SphereGeometry(
        radius, widthSegments, heightSegments);


    const solarSystem = new THREE.Object3D();
    scene.add(solarSystem);
    objects.push(solarSystem);


    const sunMaterial = new THREE.MeshPhongMaterial({emissive: 0xFF9900});
    const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
    sunMesh.scale.set(5, 5, 5);  // make the sun large
    solarSystem.add(sunMesh);
    objects.push(sunMesh);


    const earthOrbit = new THREE.Object3D();
    earthOrbit.position.x = 10;
    solarSystem.add(earthOrbit);
    objects.push(earthOrbit);


    const earthMaterial = new THREE.MeshPhongMaterial({color: 0x2233FF, emissive: 0x112244});
    const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
    earthOrbit.add(earthMesh);
    objects.push(earthMesh);


    const moonOrbit = new THREE.Object3D();
    moonOrbit.position.x = 2;
    earthOrbit.add(moonOrbit);


    const moonMaterial = new THREE.MeshPhongMaterial({color: 0x888844, emissive: 0x222222});
    const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
    moonMesh.scale.set(.5, .5, .5);
    moonOrbit.add(moonMesh);
    objects.push(moonMesh);


    // add an AxesHelper to each node
    /* objects.forEach((node) => {
      const axes: any = new THREE.AxesHelper(); // TSエラーあり -> any追加
      axes.material.depthTest = false; // TSエラー発生箇所
      axes.renderOrder = 1;
      node.add(axes);
    }); */


    {
      const color = 0xFFFFFF;
      const intensity = 3;
      const light = new THREE.PointLight(color, intensity);
      scene.add(light);
    }


    function animate() {
      requestAnimationFrame( animate );

      objects.forEach((obj) => {
        obj.rotation.y += 0.01;
        // obj.rotation.x += 0.01;
        // obj.rotation.z += 0.01;
      });

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
