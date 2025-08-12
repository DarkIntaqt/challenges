export function formatNumber(num: number, minify = false) {
   if (typeof num !== "number") return "";

   if (minify) {
      const units = ["K", "M", "B", "T"];
      let unit = "";
      let value = num;
      for (let i = units.length - 1; i >= 0; i--) {
         const size = Math.pow(10, (i + 1) * 3);
         if (num >= size) {
            value = num / size;
            unit = units[i];
            break;
         }
      }
      return `${value.toFixed(1).replace(/\.0$/, "")}${unit}`;
   }

   return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
