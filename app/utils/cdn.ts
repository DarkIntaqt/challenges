import type { Tier } from "./tier";

export const cdnDomain = "https://cdn.yearin.lol";
export const cupcakeDomain = "https://cupcake.yearin.lol";
const cdnPath = cdnDomain + "/cupcake/";
const cupcakePath = cupcakeDomain + "/cupcake/";

const dataPath = cdnDomain + "/cgg-data/";

// Get a CDN dynamic asset path (latest images update once per patch)
export function cdn(file: string, isImage = true): string {
   let path = `${cupcakePath}latest/`;
   path += file;

   if (isImage) {
      path += ".webp";
   }

   return path;
}

// Get static CDN path data in the cgg-data bucket
export function cdnData(file: string): string {
   let path = `${dataPath}${file}`;
   return path;
}

// Get a raw CDN path
export function cdnBase(file: string, isImage = true): string {
   let path = `${cdnPath}${file}`;

   if (isImage) {
      path += ".webp";
   }

   return path;
}

// Get a CDN path prefixed with assets/
export function cdnAssets(file: string, isImage = true): string {
   return cdnBase(`assets/${file}`, isImage);
}

export function getChallengeIcon(icon: number, tier: Tier = "MASTER"): string {
   if (tier === "NONCHALLENGE") tier = "MASTER";

   if (icon > 99) {
      return cdn(`challenges/tokens/${icon}-${tier.toLowerCase()}`);
   }

   if (icon === 0) {
      return cdnAssets(`challenges/crystals/${tier.toLowerCase()}`);
   }

   return cdnAssets(`challenges/categories/${icon}.webp`, false);
}

export function getProfileIcon(iconId: number): string {
   return cdn(`icons/${iconId}`);
}

export function getChampionImage(
   championKey: string,
   skinId: number | string = 0,
   type: "centered" | "splash" = "splash",
): string {
   return cdn(`champions/${type}/${championKey}_${skinId}`);
}
