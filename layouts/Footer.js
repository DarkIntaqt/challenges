import Link from "next/link";
import css from "challenges/styles/footer.module.scss";

import Logo from "challenges/assets/logo.svg";
import { faGlobe, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * Footer showing multiple important links
 * @returns Component
 */
export default function Footer() {
   return <div className={css.footer}>

      <div className={css.top}>

         <div className={`${css.linkgroup} ${css.special}`}>

            <Logo />
            <p>&copy;2022 - 2023</p>
            <p>Challenge Tracker</p>

            <p style={{
               marginTop: "10px",
               lineHeight: "1rem"
            }}>Made with <FontAwesomeIcon
                  icon={faHeart}
               /> by <Link href="https://darkintaqt.com" target="_blank">DarkIntaqt</Link>
               <br />
               and <Link href="/social/about#thanks" prefetch={false}>contributors</Link>.
            </p>

         </div>

         <div className={css.linkgroup}>
            <p>Challenge Tracker</p>

            <Link href="/social/about" prefetch={false}>About</Link>
            <Link href="/social/contact" prefetch={false}>Contact</Link>
            <Link href="/social/faq" prefetch={false}>Help & FAQ</Link>
            <Link href="/social/feedback" prefetch={false}>Feedback</Link>
            <Link href="/settings" prefetch={false}>
               <FontAwesomeIcon
                  icon={faGlobe}
               /> English
            </Link>
         </div>

         <div className={css.linkgroup}>
            <p>Social</p>

            <Link href="/social/contact" prefetch={false}>Contact</Link>
            <Link href="https://twitter.com/darkintaqt" target="_blank">Twitter</Link>
            <Link href="/community" prefetch={false}>Community</Link>
            <Link href="https://github.com/DarkIntaqt/challenges" target="_blank">Contribute on GitHub</Link>
         </div>

         <div className={css.linkgroup}>
            <p>Resources</p>

            <Link href="/social/imprint" prefetch={false}>Imprint</Link>
            <Link href="/social/tos" prefetch={false}>Terms of Service</Link>
            <Link href="/social/privacy" prefetch={false}>Privacy Policy</Link>
         </div>

      </div>

      <div className={css.bot}>

         <p>
            &apos;Challenges.DarkIntaqt.Com&apos; isn&apos;t endorsed by Riot Games and doesn&apos;t reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.
         </p>

      </div>

   </div>;
}