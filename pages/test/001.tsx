import React  from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Inner from '../../components/Inner_001';
import Footer from '../../components/Footer';
import Data from '../../data/data.json';


const pageData = Data.test001;
const pageTitle = pageData.title;
const pageText = pageData.text;


function Home() {
  return (
    <>
      <Head>
        <title>{ pageTitle }</title>
        <meta name="description" content={ pageText } />
        <meta property="og:title" content={ pageTitle } />
        <meta property="og:description" content={ pageText } />
      </Head>
      <Header />
      <main>
        <h1>{ pageTitle }</h1>
        <p>{ pageText }</p>
        <Inner />
        <ul>
          <li>コード：<a href={ pageData.code } target="_blank">{ pageData.code }</a></li>
          <li>ブログ：<a href={ pageData.blog } target="_blank">{ pageData.blog }</a></li>
        </ul>
      </main>
      <Footer />
    </>
  )
}

export default Home;