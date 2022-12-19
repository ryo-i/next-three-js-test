import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Data from '../../data/data.json';


function Home() {
  const [pageData, setPageData] = useState({});
  const [pageTitle, setPageTitle] = useState('');
  const [pageText, setPageText] = useState('');
  const [pageCode, setPageCode] = useState('');
  const [pageBlog, setPageBlog] = useState('');
  const router = useRouter();
  const { id } = router.query;


  useEffect(() => {
    const pageData = Data.test['test' + id];
    setPageData(pageData);
  }, [id]);


  useEffect(() => {
    if (pageData) {
      setPageTitle(pageData['title']);
      setPageText(pageData['text']);
      setPageCode(pageData['code']);
      setPageBlog(pageData['blog']);
    } else {
      setPageTitle(String(id));
    }
  }, [pageData]);


  const Inner = dynamic(() => import('../../components/Inner_' + id)
    .catch(err => {
      console.log('err', err);
      return () => <p>読み込めませんでした</p>
    }), {
      ssr: false,
      loading: () => <p>読み込み中...</p>,
    }
  );


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
        { id ? <Inner /> : <p>読み込み中...</p> }
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