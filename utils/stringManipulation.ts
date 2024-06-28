export function strtolower(value: any): string {
   return ("" + value).toLowerCase();
}

export function strtoupper(value: any): string {
   return ("" + value).toUpperCase();
}

export function capitalize(input: any): string {
   if (typeof input === "string") {
      if (input.length > 1) {
         input = strtolower(input);
         input =
            input.split(" ").length > 0
               ? input
                    .split(" ")
                    .map((item: string) => item[0].toUpperCase() + item.substring(1))
                    .join(" ")
               : input[0].toUpperCase() + input.substring(1);
      }
   }
   return input;
}
