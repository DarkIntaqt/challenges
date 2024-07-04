import { TitleDTO } from "challenges/types/challenges.types";

export default function getTitle(titleId: string, titles: TitleDTO[]) {
   for (let i = 0; i < titles.length; i++) {
      const title = titles[i];

      if (title.id === titleId) {
         console.log(title);
         return title;
      }

   }
   return false;
}