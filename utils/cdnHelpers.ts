import { ThresholdType } from "challenges/types/challenges.types";

const cdnUri1 = "https://cdn.darkintaqt.com/lol";
const cdnUri2 = "https://lolcdn.darkintaqt.com/cdn";

export function profileBackgroundImage(tier: string): string {
   return encodeURI(`${cdnUri1}/static/challenges/_${tier.toLowerCase()}-full.webp`);
}

export function profileIcon(id: number): string {
   return encodeURI(`${cdnUri2}/profileicon/${id.toString()}`);
}

export function profileIconFrame(tier: string): string {
   return encodeURI(`${cdnUri1}/static/challenges/card-${tier.toUpperCase()}.webp`);
}

export function challengeTokenIcon(id: number | string, type?: ThresholdType): string {
   let link = `${cdnUri2}/np-token/${id}`;
   if (type != null) link = `${link}/${type.toLowerCase()}`;
   return encodeURI(link);
}

export function filterCategoryIcon(image: string): string {
   return encodeURI(`${cdnUri1}/static/challenges/${image}`);
}

export function filterGameModeIcon(image: string): string {
   return encodeURI(`${cdnUri2}/${image}`);
}
