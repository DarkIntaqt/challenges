import clsx from "clsx";
import { Link } from "react-router";
import Heading from "@cgg/components/Heading/Heading";
import { useStaticData } from "@cgg/hooks/useStaticData";
import variables from "@cgg/styles/variables.module.scss";
import { capitalize } from "@cgg/utils/capitalize";
import { cdn, getChallengeIcon } from "@cgg/utils/cdn";
import type { ITitleDTO } from "@cgg/utils/challenges";
import type { IChampionDTO } from "@cgg/utils/champions";
import getTitle from "@cgg/utils/getTitle";
import css from "./title.module.scss";

export default function Title({
   title,
   champions,
}: {
   title: ITitleDTO;
   champions: IChampionDTO[];
}) {
   const staticData = useStaticData();

   const titleData = getTitle(title.id, staticData);
   if (!titleData) return;

   let icon: string =
      title.icon !== undefined
         ? cdn("challenges/titles/" + title.icon, false)
         : cdn("challenges/titles/player_title_generic.svg", false);
   let name: string = title.requirement?.name ?? "";
   let description: string = title.requirement?.description ?? "";
   let type: "CHALLENGE" | "CHAMPION" | "EVENT" = "EVENT";
   let percentile: number | undefined;

   if (title.challengeId !== undefined && titleData.challenge !== undefined) {
      // Add challenge name and tier to name
      // Set icon to the challenge icon
      icon = getChallengeIcon(titleData.challenge.iconId, titleData.tier);
      name = titleData.challenge.name;
      name += ` (${capitalize(titleData.tier)} tier)`;
      description = titleData.challenge.description;
      type = "CHALLENGE";

      percentile = titleData.challenge?.percentiles?.[titleData.tier];
   } else if (
      title.type === "CHAMPION_MASTERY" &&
      typeof title.requirement !== "undefined"
   ) {
      // Find the champion to provide the right image
      type = "CHAMPION";

      const champion = champions.find(
         (c) => c.name === title.requirement!.name || c.id === title.requirement!.name,
      );

      if (!champion) {
         console.warn("Can't find champion", title.requirement.name);
         return null;
      }

      icon = cdn(`champions/tiles/${champion.id}_0`);
      name = title.requirement.name;
      description = title.requirement.description;
   }

   const content = (
      <>
         <Heading level={2}>{title.name}</Heading>
         <span className={css.titleType}>
            {/*
            Show default for apprentice title, otherwise show TYPE
            If type is CHALLENGE, also show the challenges name
            */}
            {title.id === 1 ? "Default" : capitalize(type)} title
            {type === "CHALLENGE" && ` - ${name}`}
            {percentile !== undefined && ` - Top ${(percentile * 100).toFixed(1)}%`}
         </span>

         {type === "CHAMPION" && (
            <p>
               Reach {description} on {name}.
            </p>
         )}
         {type === "EVENT" && title.id !== 1 && (
            <p>
               Requirements: {name}, {description}.
            </p>
         )}
         {type === "CHALLENGE" && <p>{description}.</p>}
         <img draggable={false} src={icon} alt={name} className={css.icon} />
      </>
   );

   if (type === "CHALLENGE" && titleData.challenge !== undefined) {
      return (
         <Link
            className={clsx(
               css.title,
               css.CHALLENGE,
               css.link,
               variables[titleData.tier],
            )}
            to={`/challenges/${titleData.challenge.id}`}
         >
            {content}
         </Link>
      );
   }

   return (
      <div className={clsx(css.title, css[type], variables[titleData.tier])}>
         {content}
      </div>
   );
}
