"use client";

import Link from "next/link";
import { ReactNode } from "react";

import { TitleEntry } from "challenges/types/draft.types";
import { capitalize } from "challenges/utils/stringManipulation";

import css from "challenges/styles/titleObject.module.scss";

export default function TitleObject(props: TitleObjProps): ReactNode {
   return (
      <Link
         href={`/challenges/${props.challengeId}`}
         prefetch={false}
         className={css.title + " " + (props._isUnlocked ? props.milestone.tier : "NONE")}
      >
         <div className={css.group}>
            <p className={css.title}>{props.name}</p>
            <p className={css.subtitle}>
               {[
                  props._isUnlocked ? "" : `Locked, reach ${capitalize(props.milestone.tier)} tier`,
                  `${props.progress} / ${props.milestone.threshold}`,
               ]
                  .filter(Boolean)
                  .join(" • ")}
            </p>
         </div>

         <div className={css.description}>
            <p>{props.description}</p>
         </div>

         <div
            className={css.progress}
            style={{
               width:
                  props._isUnlocked || props.progress >= props.milestone.threshold
                     ? "100%"
                     : `calc(${props.progress} / ${props.milestone.threshold} * 100%)`,
            }}
         ></div>
      </Link>
   );
}

type TitleObjProps = TitleEntry;
