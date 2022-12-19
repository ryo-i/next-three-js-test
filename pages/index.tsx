import React, { useState }  from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Data from '../data/data.json';


const headerTitle = Data.header.title;
const headerText = Data.header.text;


function IndexList() {
  const testInfo = Data.test;
  const indexList = [];

  for (let key in testInfo) {
    indexList.push(
    <li key={ key }>
      <Link href={ testInfo[key].path }>
        {testInfo[key].title }
      </Link>
    </li>);
  }

  return <ul>{ indexList }</ul>;
};


function Home() {
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
        <section>
          <h2>作ったもの</h2>
          <IndexList />
        </section>
      </main>
      <Footer />
    </>
  )
}

export default Home;