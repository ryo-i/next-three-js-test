import React, { useState, useEffect, useContext }  from 'react';
import { indexContext } from '../context/indexContext';
import styled from 'styled-components';
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

  useEffect(() => {
    hello();
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
    </>
  );
}

export default Inner;
