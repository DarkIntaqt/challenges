import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#0dbdff" />
        <meta name="msapplication-TileColor" content="#0dbdff" />
      </Head>
      <body>
        <Main />
        <NextScript />

        {/* Cookie Management Script */}
        <script src="https://cdn.darkintaqt.com/script/cc/bundle.js" async></script>
      </body>
    </Html>
  );
}
