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
        <section>
          <h2>作ったもの</h2>
          <ul>
            <li><Link href="test/001">{ Data.test001.title }</Link></li>
            <li><Link href="test/002">{ Data.test002.title }</Link></li>
            <li><Link href="test/003">{ Data.test003.title }</Link></li>
            <li><Link href="test/004">{ Data.test004.title }</Link></li>
            <li><Link href="test/005">{ Data.test005.title }</Link></li>
            <li><Link href="test/006">{ Data.test006.title }</Link></li>
            <li><Link href="test/007">{ Data.test007.title }</Link></li>
          </ul>
        </section>
        <section>
          <h2>作成中</h2>
          <ul>
          </ul>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default Home;