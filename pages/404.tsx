import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Profile from '../components/Profile';
import Footer from '../components/Footer';
import Data from '../data/data.json';


const headerTitle = Data.header.title;
const pageTitle = '404ページ';
const pageText = 'お探しのページは見つかりませんでした。';
const headTitle = pageTitle + ' | ' + headerTitle;


// Component
function notFound() {
    return (
        <>
        <Head>
            <title>{ headTitle }</title>
            <meta name="description" content={ pageText } />
            <meta property="og:title" content={ headTitle } />
            <meta property="og:description" content={ pageText } />
        </Head>

        <Header />
        <main>
            <h1>{ pageTitle }</h1>
            <p dangerouslySetInnerHTML={{ __html: pageText }}></p>
            <section>
                <h2>Homeに戻る</h2>
                <p>こちらからお戻りください→ <Link href="/"><a>Home</a></Link></p>
            </section>
            <Profile />
        </main>
        <Footer />
        </>
    );
}

export default notFound;