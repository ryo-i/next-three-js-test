import Data from '../data/data.json';


const url = Data.head.url;


// Component
function CommonHead() {
  return (
    <>
      <meta property="og:url" content={url} />
      <meta property="og:image" content={url + "ogp.png"} />
      <meta property="og:type" content="website" />
      <meta name="twitter:site" content="@idr_zz" />
      <meta name="twitter:image" content={url + "ogp.png"} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="theme-color" content="#ffffff" />
    </>
  );
}

export default CommonHead;
