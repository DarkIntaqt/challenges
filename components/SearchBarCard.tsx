import Image from "next/image";
import Link from "next/link";

import css from "challenges/styles/index.module.scss";

interface CardProps {
   url: string;
   title: string;
   image: string;
   round?: boolean;
   tag?: string;
   imageAsBackground?: boolean;
   loader?: boolean;
}

/**
 * Returns the corresponding card for the searchBar
 */
export default function Card({ url, title, image, round = false, tag = "", imageAsBackground = false, loader = false }: CardProps) {
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
