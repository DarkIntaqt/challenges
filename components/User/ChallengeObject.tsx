"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

import { ChallengeEntry } from "challenges/types/draft.types";
import { challengeTokenIcon } from "challenges/utils/cdnHelpers";
import { capitalize } from "challenges/utils/stringManipulation";

import css from "challenges/styles/challengeObject.module.scss";

export default function ChallengeObject(props: ChallengeObjProps): ReactNode {
   return (
      <Link href={`/challenges/${props.id}`} prefetch={false} className={css.challenge + " " + props.tier}>
         <Image
            src={challengeTokenIcon(props.id, props.tier === "NONE" ? "IRON" : props.tier)}
            alt={props.name}
            height={40}
            width={40}
            loading="lazy"
            className={props.tier === "NONE" ? css.unranked : ""}
         />

         <div className={css.group}>
            <p className={css.title}>{props.name}</p>
            <p className={css.subtitle}>
               {[
                  props.tier === "NONE" ? "" : `Top ${props.percentile}%`,
                  `${props.progress} / ${props.setToMaster ? props.tierMaster.threshold : props.tierNext.threshold}`,
               ]
                  .filter(Boolean)
                  .join(" • ")}
            </p>
         </div>

         <div className={css.modes}></div>

         <div className={css.description}>
            <p>{props.description}</p>
         </div>

         <span className={css.tier}>{props.tier === "NONE" ? "Unranked" : capitalize(props.tier)}</span>

         <div
            className={css.progress}
            style={{
               width: props.setToMaster
                  ? props.progress >= props.tierMaster.threshold
                     ? "100%"
                     : `calc(${props.progress} / ${props.tierMaster.threshold} * 100%)`
                  : props.progress >= props.tierNext.threshold
                     ? "100%"
                     : `calc(${props.progress} / ${props.tierNext.threshold} * 100%)`,
            }}
         ></div>
      </Link>
   );
}

interface ChallengeObjProps extends ChallengeEntry {
   setToMaster?: boolean;
}
