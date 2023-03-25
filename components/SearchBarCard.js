import Image from "next/image";
import Link from "next/link";

import css from "challenges/styles/index.module.scss";

/**
 * @typedef CardProps
 * @type {Object}
 * @property {string} url - required
 * @property {string} title - required
 * @property {string} image - required
 * @property {boolean} round - default : true
 * @property {string} tag - default: ""
 * @property {boolean} imageAsBackground - default: false
 * @property {boolean} loader - default: false
 */


/**
 * Returns the corresponding card for the searchBar
 * @param {CardProps} props 
 * @returns 
 */
export default function Card({ url, title, image, round = false, tag = "", imageAsBackground = false, loader = false }) {
   return <Link href={url} className={css.card} prefetch={false}>
      <div className={css.inner}>
         {/* set a background */}
         {imageAsBackground === true ?
            <div className={css.bg} style={{
               backgroundImage: `url(${image})`
            }}></div>
            : <></>}
         <div className={css.content}>
            {/* Show a loader around the image */}
            {loader === true && title.length >= 3 ?
               <div className={css.loader} />
               : <></>}
            <Image
               src={image}
               height={60}
               width={60}
               alt=""
               unoptimized
               className={round === true ? css.round : ""}
            />
         </div>
      </div>
      <p>
         {title}
         {tag !== "" ?
            <span>{tag}</span>
            : <></>
         }
      </p>
   </Link>;
}
