import { cdnData } from "@cgg/utils/cdn";

export interface HomeSplashes {
   months: MonthlySplashEntry[];
}

export type QualityProfiles = {
   isVideo?: boolean; // default false
   // lq?: MediaEntry;
   normal: MediaEntry;
   hq?: MediaEntry;
};

export interface MonthlySplashEntry {
   default: QualityProfiles;
   special?: Record<number, QualityProfiles>;
}
export type MediaEntry = MediaEntrySplash | MediaEntryUrl;

interface MediaEntrySplash {
   type: "splash" | "centered";
   championKey: string;
   skinId: number;
   url?: never;
}

interface MediaEntryUrl {
   type?: never;
   championKey?: never;
   skinId?: never;
   url: string;
}

const homeSplashes: HomeSplashes = {
   months: [
      {
         // January
         default: {
            normal: {
               championKey: "Anivia",
               type: "splash",
               skinId: 46,
            },
         },
      },
      {
         // February
         default: {
            normal: {
               championKey: "Vi",
               type: "splash",
               skinId: 29,
            },
         },
      },
      {
         // March
         default: {
            normal: {
               championKey: "Kassadin",
               type: "centered",
               skinId: 14,
            },
         },
      },
      {
         // April
         default: {
            normal: {
               championKey: "Karma",
               type: "splash",
               skinId: 7,
            },
         },
      },
      {
         // May
         default: {
            normal: {
               championKey: "Olaf",
               type: "splash",
               skinId: 25,
            },
         },
      },
      {
         // June
         default: {
            normal: {
               championKey: "Bard",
               type: "splash",
               skinId: 8,
            },
         },
      },
      {
         // July
         default: {
            normal: {
               championKey: "Graves",
               type: "splash",
               skinId: 5,
            },
         },
      },
      {
         // August
         default: {
            normal: {
               championKey: "Fiora",
               type: "splash",
               skinId: 1,
            },
         },
      },
      {
         // September
         default: {
            normal: {
               championKey: "Diana",
               type: "centered",
               skinId: 26,
            },
         },
      },
      {
         // October
         default: {
            normal: {
               championKey: "Elise",
               type: "splash",
               skinId: 6,
            },
            hq: {
               url: cdnData("home/Elise_6_HQ.webp"),
            },
         },
      },
      {
         // November
         default: {
            normal: {
               championKey: "Jax",
               type: "centered",
               skinId: 13,
            },
            hq: {
               url: cdnData("home/Jax_13_HQ.webp"),
            },
         },
      },
      {
         // December
         default: {
            normal: {
               championKey: "Poppy",
               type: "splash",
               skinId: 14,
            },
            hq: {
               url: cdnData("home/Poppy_14_HQ.webp"),
            },
         },
      },
   ],
};

export { homeSplashes };
