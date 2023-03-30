import css from "challenges/styles/social.module.scss";
import Head from "next/head";

export default function ErrorPage({ err }) {

   return <>
      <Head>
         <title>An error occurred</title>
      </Head>
      <section className={css.wrapper}>
         <h1 className={css.notFixed}>An error occurred</h1>
      </section>
   </>;

}