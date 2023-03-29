import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import css from "challenges/styles/social.module.scss";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";


function openInNewTab(e) {
   const element = e.currentTarget;

   window.open(element.src, "_blank");
}


export default function About() {


   useEffect(() => {
      if (window.location.hash !== "") {
         setTimeout(() => {
            if (document.getElementById(window.location.hash.substring(1))) {
               document.getElementById(window.location.hash.substring(1)).scrollIntoView({ behavior: "smooth", block: "center" });
            }
         }, 50);
      }
   });

   return <>
      <Head>
         <title>About the Challenge Tracker</title>
      </Head>

      <div className={css.bgImage}>
         <Image src="https://lolcdn.darkintaqt.com/cdn/challenge-preview.png" fill={true} alt="" unoptimized />
      </div>
      <section className={css.wrapper}>

         <h1>About</h1>

         <div className={css.quote} style={{ marginBottom: "20px" }}>
            <q>
               Make LoL Challenges easily understandable and accessible from everywhere.
            </q>
         </div>

         <div className={css.imageGroup} style={{ marginBottom: "20px" }}>
            <Image
               src="https://cdn.darkintaqt.com/image/challenges/current-challenge.png?v3"
               alt="The old challenge page design"
               width={1100}
               height={850}
               onClick={openInNewTab}
               unoptimized
            />

            <Image
               src="https://cdn.darkintaqt.com/image/challenges/current-profile.png"
               alt="The old profile design"
               width={440}
               height={176}
               onClick={openInNewTab}
               unoptimized
            />

            <Image
               src="https://cdn.darkintaqt.com/image/challenges/current-challenges.png?v3"
               alt="The old challenges design"
               width={440}
               height={210}
               onClick={openInNewTab}
               unoptimized
            />
         </div>

         <p>Welcome to the about page of Challenge Tracker. This is about the history, the current state and future plans for this site. </p>


         <p>Additionally, there is a section for every contributor so far. Thanks for using this site ^^</p>


         <h2 id="dev">Development history</h2>

         <p>This project is old. The first version was created just after challenges hit the PBE. That was around November 2021, 6 months before the initial challenge release. Unfortunately, neither the first version of the source code nor screenshots exist of the oldest version. </p>
         <p>The first version of this site was published exactly 5 days after the Challenge release. Even though it wasn&apos;t publicly shared, there were some people using the site already. </p>

         <Image
            src="https://cdn.darkintaqt.com/image/challenges/05-19-2022.png"
            height={192}
            width={251}
            alt="A challenge Object"
            className={css.centered}
            onClick={openInNewTab}
            unoptimized
         ></Image>
         <p>This image shows the very first version of a Challenge progress. It still looks pretty similar to the current one, doesn&apos;t it?</p>

         <p>A few days later the challenge selection was expanded: Multiple filter methods were added, also a very league-like banner to show-off the selected challenges. Here is a semi-good screenshot of the version from the 31st of March 2022:</p>
         <Image
            src="https://cdn.darkintaqt.com/image/challenges/05-31-2022.png"
            height={325}
            width={385}
            alt="The old profile page"
            className={css.centered}
            onClick={openInNewTab}
            unoptimized
         ></Image>
         <p>The first version was coded in PHP. I would like not to start a discussion about this programming language. This version didn&apos;t had many features, it was only supporting the summoner lookup. </p>

         <p>PHP was slow and not very reactive. That&apos;s why the whole project was re-coded in reactjs</p>

         <p>Soon after this, leaderboards were added. First, only API-supported leaderboards were shown. A bit later all leaderboards were supported by a database. That was around July 2022. </p>
         <div className={css.imageSideToSide}>
            <Image
               src="https://cdn.darkintaqt.com/image/challenges/07-21-2022.png"
               height={343}
               width={480}
               alt="The old leaderboard page"
               unoptimized
               onClick={openInNewTab}
            ></Image>

            <Image
               src="https://cdn.darkintaqt.com/image/challenges/08-10-2022.png"
               height={343}
               width={480}
               alt="The old leaderboard page, version 2"
               unoptimized
               onClick={openInNewTab}
            ></Image>

            <Image
               src="https://cdn.darkintaqt.com/image/challenges/09-03-2022.png"
               height={343}
               width={480}
               alt="The old leaderboard page, version 3"
               unoptimized
               onClick={openInNewTab}
            ></Image>
         </div>


         <p>After that, dynamic thresholds were added, as well as child and parent challenges. The latter feature was removed to create some space for the current design. </p>

         <p>On October 3rd, the logo was changed to the current design:</p>

         <Image
            src="https://cdn.darkintaqt.com/image/challenges/10-03-2022.png?v2"
            height={250}
            width={394}
            className={css.centered}
            alt="Logo rework"
            unoptimized
            onClick={openInNewTab}
         ></Image>

         <p>Finally, only a few small changes were added such as the translation(s), the verified badge and more and more filter options. </p>
         <p>Sooo... That was basically the last &quot;big&quot; change. Now, the current project is re-written in another, similar JavaScript Framework: NextJS. </p>

         <h2 id="future">Now, next(JS) and the future</h2>

         <p>The whole project got rewritten in NextJS. That was a lot of work. Luckily, several contributors on GitHub helped to create the page you are currently on. </p>
         <p>In my opinion, this website is in a good state. After some up and downs (mostly API related), the Database is stable, the leaderboards are pretty much correct (as correct as they can be without api supported leaderboards) and there are no rate limits to run into the whole time. </p>
         <p>Currently, the site should be able to run without any external help and I would like to keep it that way. There are currently not many ideas for the future except to keep this site running. If YOU have an idea for a feature, go to <Link href="/social/feedback">the feedback section</Link>. Thank you in advance. </p>

         <h2 id="thanks">Thanks to all the contributors</h2>

         <p>Whether helping with the source code, translating the site or just giving feedback. Without contributors, this project probably wouldn&apos;t have gotten anywhere near this far.</p>

         <div className={css.thanks}>
            <h3>BlossomiShymae</h3>

            <p>Thanks a lot to BlossomiShymae for migrating huge parts of the old page into nextJS. But not just migrating but also refactoring, documentating and helping with the new nextJS page. </p>
            <a href="https://github.com/BlossomiShymae" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faLink} /> BlossomiShymae&apos;s GitHub</a>
         </div>

         <div className={css.thanks}>
            <h3>NicoW</h3>

            <p>Thanks a lot for your feedback, the image analyzation and optimization! Additionally, thanks a lot for the Spanish translation. </p>
         </div>

         <div className={css.thanks}>
            <h3>Pyke</h3>

            <p>Thanks a lot for finding several severe bugs, the and the great and creative feedback. Most of the feedback has made it 1:1 into the site. </p>
         </div>


      </section>
   </>;
}