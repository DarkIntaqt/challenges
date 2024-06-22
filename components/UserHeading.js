import ContentService from "challenges/services/ContentService";
import css from "challenges/styles/user.heading.module.scss";
import { intToTier } from "challenges/utils/intToTier";
import { capitalize } from "challenges/utils/stringManipulation";
import Image from "next/image";
import Link from "next/link";
import VipBadge from "./VipBadge";

export default function UserHeading({ user, tier, title, selections, verified }) {

   const contentService = new ContentService();

   const imageSrc = contentService.getProfileIcon(user.icon);

   const filter = (verified === false) ? "grayscale(100%)" : "";

   return <div className={css.head}>

      <Image src={imageSrc} height={100} width={100} alt="" unoptimized className={tier} />

      <Image src={"https://cdn.darkintaqt.com/lol/static/challenges/card-" + tier + ".webp"} height={140} width={140} unoptimized className={css.edge} alt="" />

      <div>

         <h1>{user.name} <Link href={(verified === false) ? "/verify" : "/social/faq"} prefetch={false}><VipBadge size={"2rem"} filter={filter} margin="0" /></Link></h1>

         <div className={css.tags}>

            <div className={`${css.tag} ${css.tier} ${tier}`}>
               <span>
                  <Link href="/challenges/0">
                     {capitalize(tier)}
                  </Link>
               </span>
            </div>

            {title !== false ? <div className={`${css.tag} ${css.title} ${intToTier(title.challengeTier)}`}>
               <div className={css.svg}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path fillRule="evenodd" clipRule="evenodd" d="M11.2404 10.5439C11.2517 10.5442 11.263 10.5444 11.2744 10.5444C11.9228 10.5444 12.4485 10.0188 12.4485 9.37034C12.4485 8.72194 11.9228 8.19631 11.2744 8.19629C10.6261 8.19631 10.1004 8.72194 10.1004 9.37035C10.1004 10.0073 10.6077 10.5259 11.2404 10.5439Z" fill="#fff" />
                     <path fillRule="evenodd" clipRule="evenodd" d="M16.4999 6.49996C16.5002 3.99997 13.8184 1.01395 11.1347 2.10758C11.0026 3.13423 10.262 4.56135 9.12703 6.00342C10.1043 6.3883 10.8658 6.92223 11.4568 7.50501C12.061 7.56331 12.5813 7.90847 12.8798 8.40264C14.0073 7.40364 15.2373 6.68877 16.4999 6.49996ZM9.41075 9.17259C9.40393 9.23759 9.40044 9.30358 9.40044 9.37039C9.40044 10.1322 9.85495 10.7878 10.5076 11.0809C9.05788 13.0953 7.98792 15.3513 7.56352 16.9317C7.56352 14.1314 4.76319 11.3311 1.96289 11.3311C3.89848 10.7046 5.75784 9.44547 7.29171 8.00272C8.17242 8.28617 8.86512 8.70214 9.41075 9.17259ZM11.1578 8.20206C11.3882 8.45124 11.5853 8.70664 11.754 8.95861C11.8299 9.07195 11.9001 9.1848 11.9651 9.29628C11.6956 9.58428 11.434 9.88615 11.1813 10.198C11.1361 10.1238 11.0887 10.0493 11.0392 9.97477C10.8048 9.62181 10.5227 9.26875 10.1841 8.93445C10.3434 8.53637 10.7144 8.24585 11.1578 8.20206ZM10.5589 7.63775C10.1684 7.79924 9.84428 8.08895 9.63915 8.45441C9.14325 8.06535 8.55232 7.72021 7.84933 7.45584C7.939 7.36415 8.02731 7.27196 8.1142 7.1794C8.30201 6.97931 8.48315 6.77743 8.65705 6.57485C9.42689 6.84948 10.0517 7.22191 10.5589 7.63775Z" fill="#fff" />
                     <path fillRule="evenodd" clipRule="evenodd" d="M12.448 9.3703C12.448 10.0187 11.9224 10.5444 11.274 10.5444C11.1556 10.5444 11.0412 10.5268 10.9335 10.4942C10.9194 10.237 10.9182 10.0862 10.9182 10.0862L11.684 10.1679C11.3778 9.92947 11.2055 9.77422 11.2055 9.77422L12.0162 8.56543C12.0162 8.56543 12.0725 8.58572 12.1769 8.61979C12.3462 8.82327 12.448 9.08489 12.448 9.3703ZM10.9907 11.2232C11.1964 13.255 11.9847 17.2739 14.9998 16.9999C13.9998 15.9999 13.9998 15.3422 13.9998 14.9999C13.9998 14.9999 15.4998 14.9999 16.4998 13.9999C13.603 13.0343 12.9689 11.7804 12.8848 11.0094C14.4129 11.9719 16.7649 13.0586 18.9998 12.4999C18.9998 12.4999 17.4998 11.9999 16.6665 10.9185C16.6665 10.9185 18.4998 10.9999 18.9998 8.9999C16.9629 9.67885 14.4726 9.23557 13.0836 8.88096C13.1257 9.03695 13.1481 9.201 13.1481 9.3703C13.1481 10.4054 12.309 11.2444 11.274 11.2444C11.1777 11.2444 11.0831 11.2372 10.9907 11.2232Z" fill="#fff" />
                     <path fillRule="evenodd" clipRule="evenodd" d="M4.62915 15.4945C3.69572 15.4945 3.229 14.561 3.69572 14.0943C4.16244 13.6276 4.83791 14.1216 5.09587 14.561C5.3468 14.9884 5.38276 15.7611 5.15288 16.2633C4.96882 16.6654 4.40592 16.7426 3.79964 16.4651C2.23599 15.7493 1.28811 13.7806 1.18753 12.7952C1.18291 12.6896 1.1908 12.5955 1.20915 12.5118C0.672298 13.3794 1.19379 15.0272 2.48841 16.3865C3.90752 17.8765 5.7182 18.4555 6.53267 17.6798C7.34715 16.9041 6.857 15.0673 5.43789 13.5774C4.79791 12.9054 4.07828 12.4187 3.40631 12.158L3.37278 12.153C3.37278 12.153 1.56171 11.7979 1.70875 13.0338C1.91126 14.7359 4.68415 16.7515 4.62915 15.4945Z" fill="#fff" />
                  </svg>


               </div>
               <span>
                  <Link href={"/challenges/" + title.challengeId}>
                     {title.title}
                  </Link>
               </span>
            </div> : <></>}

         </div>

         <div className={css.selections}>
            {selections}
         </div>

      </div>

   </div>;

}
