import React, { useState }  from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Data from '../data/data.json';


const headerTitle = Data.header.title;
const headerText = Data.header.text;


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
        <h1>作ったもの</h1>
        <ul>
          <li><Link href="test/001"><a>{ Data.test001.title }</a></Link></li>
        </ul>
      </main>
      <Footer />
    </>
  )
}

export default Home;