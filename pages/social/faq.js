import { Component } from "react";

import Head from "next/head";
import css from "challenges/styles/social.module.scss";
import Image from "next/image";


const faq = [

   {
      id: "ChallengePage",
      question: "How does the challenge page work?",
      text: "The challenge page contains everything you need to know. On the top the challenge name and description shown, as well as the title and the capstones. You can pin a challenge if you want to. On the left side, there is an information about the challenge, as well as the thresholds. On the right side there is the challenge leaderboard. It is sorted by points, tier and then timestamp achieved. You can select specific regions, using SHIFT even several at once. "
   }

];


function Question({ question, id, text }) {

   function magic(e) {
      e.currentTarget.classList.toggle(css.active);
   }

   return <div className={css.accordion} id={id} key={id} onClick={magic}>

      <div className={css.teaser} role="button">
         <h2>{question}</h2>
      </div>

      <div className={css.body}>
         <p>
            {text}
         </p>
      </div>

   </div>;

}


export default class FAQ extends Component {

   constructor() {
      super();
   }

   componentDidMount() {
      if (window.location.hash !== "") {
         setTimeout(() => {
            if (document.getElementById(window.location.hash.substring(1))) {
               document.getElementById(window.location.hash.substring(1)).scrollIntoView({ behavior: "smooth", block: "center" });
               document.getElementById(window.location.hash.substring(1)).click();
            }
         }, 50);
      }
   }

   render() {

      let questions = faq.map((question) => <Question key={question.id} id={question.id} question={question.question} text={question.text} />);

      return <>

         <Head>
            <title>Frequently Asked Questions</title>
         </Head>

         <div className={css.bgImage}>
            <Image src="https://cdn.darkintaqt.com/lol/static/challenges/_iron-full.webp" fill={true} alt="" unoptimized />
         </div>

         <section className={css.wrapper}>

            <h1 className={css.notFixed}>FAQ</h1>

            {questions}

         </section>

      </>;

   }

}
