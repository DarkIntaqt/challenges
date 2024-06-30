import ChallengeService from "challenges/services/ChallengeService";
import css from "challenges/styles/titles.module.scss";
import Link from "next/link";
import { TitleDTO } from "challenges/types/challenges.types";

export default async function Titles() {
   const { titles }: { titles: TitleDTO[] } = await getData();

   return <div className={"object1000"}>

      <h1 className={css.heading}>All titles</h1>
      <p className={css.subheading}>A list of all League of Legends Title Challenges and how to achieve them</p>

      {titles.map((title) => {
         if (title.challengeId === undefined) {
            return null;
         }
         return <>
            <Link href={"/challenges/" + title.challengeId} prefetch={false}>{title.name}</Link><br />
         </>;
      })}


   </div>;
}

async function getData() {
   const challengeService = new ChallengeService();

   const all = await challengeService.listAll("na1", "en_US");

   if (all === undefined) {
      throw new Error("Error loading titles");
   }

   return {
      titles: Object.values(all.titles || {})
   };
}