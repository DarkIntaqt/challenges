"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { ReactNode } from "react";

import { ProfileRouteParams } from "challenges/types/profile-navigation.types";
import { capitalize } from "challenges/utils/stringManipulation";

import css from "challenges/styles/user.module.scss";

const tabsConfig: TabConfig[] = [
   { key: "overview", slug: "" },
   { key: "titles", slug: "titles" },
   { key: "statistics", slug: "statistics" },
   { key: "history", slug: "history" },
];

export default function ProfileTabs({ params }: { params: ProfileRouteParams }): ReactNode {
   const current = useSelectedLayoutSegment() ?? "";

   return (
      <div className={css.navigation}>
         {tabsConfig.map((tab) => (
            <Link
               key={tab.key}
               href={`/profile/${params.region}/${params.summoner}/${tab.slug}`}
               className={tab.slug === current ? css.active : ""}
            >
               {capitalize(tab.key)}
            </Link>
         ))}
      </div>
   );
}

interface TabConfig {
   key: string;
   slug: string;
   sticker?: string;
}
