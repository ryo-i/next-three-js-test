import styled from 'styled-components';
import Head from 'next/head';
import Header from '../components/Header';
import Profile from '../components/Profile';
import Footer from '../components/Footer';
import Data from '../data/data.json';


const headerTitle = Data.header.title;
const pageTitle = 'このアプリについて';
const pageText = 'アプリの概要をここに書く。';
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
                    <li>CSSの初期設定を追加 <a href="https://github.com/ryo-i/next-app-started/issues/1">#1</a></li>
                </ul>
            </section>
            <section>
                <h2>使い方</h2>
                <section>
                    <h3>タイトル</h3>
                    <p>説明説明説明説明説明説明説明説明</p>
                </section>
                <section>
                    <h3>タイトル</h3>
                    <p>説明説明説明説明説明説明説明説明</p>
                </section>
                <section>
                    <h3>タイトル</h3>
                    <p>説明説明説明説明説明説明説明説明</p>
                </section>
            </section>
            <section>
                <h2>詳細</h2>
                <section>
                    <h3>ブログ</h3>
                    <p><a href="https://www.i-ryo.com/entry/2021/05/01/184600" target="_blank">【React】Nextスターターキットを作った-1 - クモのようにコツコツと</a></p>
                    <p><a href="https://www.i-ryo.com/entry/2021/05/02/101424" target="_blank">【React】Nextスターターキットを作った-2 - クモのようにコツコツと</a></p>
                    <p><a href="https://www.i-ryo.com/entry/2021/05/02/102630" target="_blank">【React】Nextスターターキットを作った-3 - クモのようにコツコツと</a></p>
                </section>
                <section>
                    <h3>ソースコード（GitHub）</h3>
                    <p><a href="https://github.com/ryo-i/next-app-started" target="_blank">リポジトリ</a></p>
                </section>
            </section>
            <Profile />
        </Main>
        <Footer />
        </>
    );
}

export default About;