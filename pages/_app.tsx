import React, { useEffect }  from 'react';
import Head from 'next/head'
import CommonHead from '../components/CommonHead';
import { createGlobalStyle } from 'styled-components';
import { pageSize } from '../styles/mixin';
import cssVariables from '../styles/variables.json';
import '../styles/styles.css';

const variable = cssVariables.variable;


// Style
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: sans-serif;
    font-size: ${variable.textSize};
    color: ${variable.textColor};
    *, *:before, *:after {
        box-sizing: border-box;
    }
    a {
        color: ${variable.baseColor};
        &:hover {
          opacity: 0.8;
        }
    }
    section {
      margin: 30px 0;
    }
    h1, h2, h3, h4, h5, h6, p, figure, ul, ol, dl, table {
      margin: 0 0 10px;
    }
    h1, h2, h3, h4, h5, h6 {
      line-height: 1.25;
    }
    p {
      line-height: 1.75;
      margin: 0 0 10px;
    }
    ul, ol {
      margin: 1em 0;
      padding: 0 0 0 1.5em;
      li {
        margin: 0 0 0.5em;
      }
    }
    dl {
      display: flex;
      flex-wrap: wrap;
      margin: 1em 0;
      @media(max-width: 600px) {
        display: block;
      }
      dt {
        font-weight: bold;
        width: 20%;
        padding-right: 1em;
        @media(max-width: 600px) {
          width: 100%;
          padding: 0;
        }
        ::after {
          content: "："
        }
      }
      dd {
        margin: 0 0 0.5em;
        width: 80%;
        @media(max-width: 600px) {
          width: 100%;
        }
      }
    }
    table {
      width: 100%;
      margin: 1em 0;
      border-spacing: 0;
      th, td {
        padding: 5px;
        border-bottom:1px solid #ccc;
      }
    }
  }
  main {
    ${pageSize}
    padding: 50px 50px 0;
    @media(max-width: 600px) {
      padding: 30px 30px 0;
    }
    h1 {
      font-size: 1.75em;
    }
    h2 {
      font-size: 1.5em;
    }
    h3 {
      font-size: 1.25em;
    }
  }
`;


function MyApp({ Component, pageProps }) {
  // For FOUC
  useEffect(() => {
    const removeFouc = (foucElement) => {
      foucElement.className = foucElement.className.replace('no-fouc', 'fouc');
    };
    removeFouc(document.documentElement);
  });

  return (
    <>
      <Head>
        <CommonHead />
      </Head>
      <GlobalStyle />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
