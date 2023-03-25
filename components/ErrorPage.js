import css from "challenges/styles/social.module.scss";
import Head from "next/head";

export default function ErrorPage({ err }) {

   return <>
      <Head>
         <title>An error occurred</title>
      </Head>
      <section className={css.wrapper}>
         <h2>An error occurred</h2>
      </section>
   </>;

}