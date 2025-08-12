export function capitalize(input: string) {
   return input
      .toLowerCase()
      .split(" ")
      .map((word) => {
         return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
}
