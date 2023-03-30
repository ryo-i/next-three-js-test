import styled from 'styled-components';
import Head from 'next/head';
import Header from '../components/Header';
import Profile from '../components/Profile';
import Footer from '../components/Footer';
import Data from '../data/data.json';


const headerTitle = Data.header.title;
const pageTitle = 'このサイトについて';
const pageText = 'Next.js環境でThree.jsが動くのかを検証しています。';
const headTitle = pageTitle + ' | ' + headerTitle;


// CSS in JS
const Main = styled.main`
    h2 {
        background: #eee;
        margin: 60px 0 20px;
        padding: 10px;
        border-radius: 3px;
    }
    h3 {
        margin: 40px 0 10px;
        padding: 0 0 10px;
        border-bottom: 1px solid #ddd;
    }
    figure {
        margin: 0 0 30px;
        img {
            max-width: 100%;
            box-shadow: 0 0 15px 2px rgb(0 0 0 / 10%);
        }
        figcaption {
            margin: 0 0 10px;
            font-size: 12px;
            font-weight: bold;
        }
    }
`;


// Component
function About() {
    return (
        <>
        <Head>
            <title>{ headTitle }</title>
            <meta name="description" content={ pageText } />
            <meta property="og:title" content={ headTitle } />
            <meta property="og:description" content={ pageText } />
        </Head>

        <Header />
        <Main>
            <h1>{ pageTitle }</h1>
            <p dangerouslySetInnerHTML={{ __html: pageText }}></p>
            <section>
                <h2>進捗</h2>
                <ul>
                    <li>039のエラーの除外とコメントで記録<a href="https://github.com/ryo-i/next-app-started/issues/10">#10</a></li>
                    <li>トップのindexを新着順に変更 <a href="https://github.com/ryo-i/next-app-started/issues/3">#3</a></li>
                </ul>
            </section>
            <section>
                <h2>詳細</h2>
                <section>
                    <h3>ブログ</h3>
                    <p><a href="https://www.i-ryo.com/entry/2022/11/15/133243" target="_blank">【Three.js + Next.js】Three.js再始動！Next.js環境でThree.jsを動かすの巻 - クモのようにコツコツと</a></p>
                </section>
                <section>
                    <h3>ソースコード（GitHub）</h3>
                    <p><a href="https://github.com/ryo-i/next-three-js-test" target="_blank">リポジトリ</a></p>
                </section>
            </section>
            <Profile />
        </Main>
        <Footer />
        </>
    );
}

export default About;