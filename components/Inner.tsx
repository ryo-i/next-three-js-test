import React, { useState, useEffect, useContext, useRef }  from 'react';
import { indexContext } from '../context/indexContext';
import styled from 'styled-components';
import * as THREE from 'three/src/Three';
import { hello } from '../modules/hello/hello';


// CSS in JS
const H2 = styled.h2`
  color: red;
`;

// Component
function Inner() {
  // Hooks
  const [title, setTitle] = useState('内容が無いよう');
  const [text, setText] = useState('へんじがない、ただのしかばねのようだ。');
  const {innerData, setInnerData} = useContext(indexContext);

  const canvasElm = useRef(null);

  useEffect(() => {
    hello();

    // three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    canvasElm.current.appendChild( renderer.domElement );

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    camera.position.z = 5;

    function animate() {
      requestAnimationFrame( animate );

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render( scene, camera );
    };

    animate();
  });

  // JSX
  return (
    <>
      {
        // innerData.length >= 5 // test
        innerData.length >= 1
          ? innerData.map((inner, index) =>
            <section key={ index }>
              <H2>{ inner.title }</H2>
              <p dangerouslySetInnerHTML={{ __html: inner.text }}></p>
            </section>
          )
          : <section>
              <h2>{ title }</h2>
              <p>{ text }</p>
          </section>
      }
      <div className="canvasElm" ref={canvasElm}></div>
    </>
  );
}

export default Inner;
