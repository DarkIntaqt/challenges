export default function getTitle(titleId, titles) {
   for (let i = 0; i < titles.length; i++) {
      const title = titles[i];

      if (title.titleId === titleId) {
         console.log(title);
         return title;
      }

   }
   return false;
}