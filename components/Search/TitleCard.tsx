import React from "react";
import Image from "next/image";
import Link from "next/link";

import css from "./card.module.scss";

import Tilt from "react-parallax-tilt";


export default function TitleCard({ title, url, image }: Readonly<{ title: string, url: string, image: string }>) {


   return <Tilt
      tiltReverse={true}
      tiltMaxAngleX={5}
      tiltMaxAngleY={5}
      tiltEnable={false}
      glareEnable={true}
      glareMaxOpacity={0.25}
      glareBorderRadius={"8px"}
      scale={1.02}
      className={css.result}>
      <Link href={url} prefetch={false} className={css.content}>
         <div className={`${css.loader} ${css.loaded}`}>
            <Image
               src={image}
               alt=""
               height={64}
               width={64}
            />
         </div>

         <p>{title}</p>
      </Link>
   </Tilt>;

}



