import type { ResponseProfiles } from "@cgg/loader/_index";
import css from "./splashBackground.module.scss";

export default function SplashBackground({ splash }: { splash: ResponseProfiles }) {
   if (splash.isVideo) {
      return (
         <video autoPlay muted loop playsInline className={css.bgSplash}>
            {splash.hq && (
               <source media="(width >=1200px)" srcSet={splash.hq} draggable={false} />
            )}
            <source src={splash.normal} type="video/webm" />
         </video>
      );
   }

   return (
      <picture className={css.bgSplash}>
         {splash.hq && (
            <source media="(width >=1200px)" srcSet={splash.hq} draggable={false} />
         )}
         <img src={splash.normal} draggable={false} alt="" />
      </picture>
   );
}
