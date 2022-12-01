import React  from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Inner from '../../components/Inner_002';
import Footer from '../../components/Footer';
import Data from '../../data/data.json';


const pageData = Data.test002;
const pageTitle = pageData.title;
const pageText = pageData.text;
const pageCode = pageData.code;
const pageBlog = pageData.blog;


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
          <li>コード：<a href={ pageCode } target="_blank">{ pageCode }</a></li>
          { pageBlog  && <li>ブログ：<a href={ pageBlog } target="_blank">{ pageBlog }</a></li> }
        </ul>
      </main>
      <Footer />
    </>
  )
}

export default Home;