import clsx from "clsx";
import { FaHeart } from "react-icons/fa6";
import { Link } from "react-router";
import logo from "@cgg/assets/logo.svg?no-inline";
import Container from "@cgg/components/Container/Container";
import { brandName } from "@cgg/config/config";
import css from "./footer.module.scss";

export default function Footer() {
   return (
      <footer className={css.footer}>
         <Container center large className={css.content}>
            <Group center>
               <div className={css.special}>
                  <img src={logo} alt={brandName} className={css.logo} />
                  <p className={css.name}>
                     {brandName}
                     <br />
                     <span>&copy; 2022 - {new Date().getFullYear()}</span>
                  </p>
               </div>
               <p>
                  Made with <FaHeart className={css.heart} /> by{" "}
                  <Link to="https://darkintaqt.com" target="_blank">
                     DarkIntaqt
                  </Link>
                  , the{" "}
                  <Link to="https://yearin.lol/about" target="_blank">
                     YearIn.LoL team
                  </Link>{" "}
                  and{" "}
                  <Link to="/about" prefetch="intent">
                     contributors
                  </Link>
                  .
               </p>
            </Group>

            <Group>
               <span>Sitemap</span>
               <Link to="/">Home</Link>
               <Link to="/titles">Titles</Link>
               <Link to="/challenges">Challenges</Link>
               <Link to="/challenges/0">Leaderboard</Link>
            </Group>

            <Group>
               <span>Contact Us</span>
               <Link to="/about" prefetch="intent">
                  About
               </Link>
               <Link to="/about/contact" prefetch="intent">
                  Contact
               </Link>
               <Link to="/about/faq" prefetch="intent">
                  Help & FAQ
               </Link>
            </Group>

            <Group>
               <span>Socials</span>
               <Link to="https://twitter.com/darkintaqt" target="_blank">
                  Twitter
               </Link>
               <Link to="/communities" prefetch="intent">
                  Community
               </Link>
               <Link to="https://github.com/DarkIntaqt/challenges" target="_blank">
                  Contribute on GitHub
               </Link>
            </Group>

            <Group>
               <span>Resources</span>
               <Link to="/about/imprint" prefetch="intent" rel="nofollow">
                  Imprint
               </Link>
               <Link to="/about/privacy" prefetch="intent" rel="nofollow">
                  Privacy Policy
               </Link>
               <Link to="/about/terms" prefetch="intent" rel="nofollow">
                  Terms of Service
               </Link>
            </Group>
         </Container>
      </footer>
   );
}

function Group({
   children,
   center = false,
}: {
   children: React.ReactNode;
   center?: boolean;
}) {
   return <div className={clsx(css.group, center && css.center)}>{children}</div>;
}
