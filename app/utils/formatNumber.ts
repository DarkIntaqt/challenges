const units = ["K", "M", "B", "T"] as const;
type Units = (typeof units)[number];

export function formatNumber(num: number, minify: boolean | Units = false) {
   if (typeof num !== "number") return "";

   if (minify) {
      const index = units.indexOf(minify === true ? units[0] : minify);

      if (index >= 0 && num >= 10 ** ((index + 1) * 3)) {
         let unit = "";
         let value = num;
         for (let i = units.length - 1; i >= 0; i--) {
            const size = 10 ** ((i + 1) * 3);
            if (num >= size) {
               value = num / size;
               unit = units[i];
               break;
            }
         }
         return `${value.toFixed(1).replace(/\.0$/, "")}${unit}`;
      }
   }

   return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
