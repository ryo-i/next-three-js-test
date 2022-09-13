import React, { useState }  from 'react';
import { indexContext } from '../context/indexContext';
import Head from 'next/head';
import Header from '../components/Header';
import Inner from '../components/Inner';
import Footer from '../components/Footer';
import Data from '../data/data.json';


const headerTitle = Data.header.title;
const headerText = Data.header.text;
const pageTitle = Data.main.title;
const pageText = Data.main.text;


function Home() {
  // Hooks
  const [innerData, setInnerData] = useState(Data.inner);

  return (
    <>
      <Head>
        <title>{ headerTitle }</title>
        <meta name="description" content={ headerText } />
        <meta property="og:title" content={ headerTitle } />
        <meta property="og:description" content={ headerText } />
      </Head>
      <Header />
      <main>
        <h1>{ pageTitle }</h1>
        <p dangerouslySetInnerHTML={{ __html: pageText }}></p>
        <indexContext.Provider value={{innerData, setInnerData}} >
          <Inner />
        </indexContext.Provider>
      </main>
      <Footer />
    </>
  )
}

export default Home;