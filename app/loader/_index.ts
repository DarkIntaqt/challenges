import logoSlogan from "@cgg/assets/logo-slogan.svg?no-inline";
import { type MediaEntry, homeSplashes } from "@cgg/config/home";
import { fetchApi } from "@cgg/utils/api";
import { cdnData, getChampionImage } from "@cgg/utils/cdn";

export interface ResponseProfiles {
   isVideo: boolean;
   normal: string;
   // lq?: string;
   hq?: string;
}

interface LogoReq {
   logo: "default" | string;
}

function getSplashMedia(entry?: MediaEntry): string | undefined {
   if (!entry) return undefined;

   if (entry.url) {
      return entry.url;
   } else if (entry.championKey) {
      return getChampionImage(entry.championKey, entry.skinId, entry.type);
   }

   // this shouldnt happen
   return undefined;
}

export async function indexLoader() {
   const date = new Date();
   const today = date.getDate();

   const month = homeSplashes.months[date.getMonth()];
   let media = month.default;
   if (month.special && month.special[today]) {
      media = month.special[today];
   }

   const isVideo = media.isVideo ?? false;

   const splashResponse: ResponseProfiles = {
      isVideo,
      normal: getSplashMedia(media.normal)!,
      hq: getSplashMedia(media.hq),
      // lq: getSplashMedia(media.lq),
   };

   const getLogo = await fetchApi<LogoReq>(cdnData("/home/config.json"));
   if (getLogo === null) {
      throw new Error("Failed to fetch logo config");
   }
   const logo = getLogo.logo === "default" ? logoSlogan : cdnData(`home/${getLogo.logo}`);

   return { splash: splashResponse, logo };
}
