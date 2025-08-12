import regions from "@cgg/config/json/regions.json";
import type { RegionsJSON } from "@cgg/config/json/regions.types";

interface IRegionToStringResponse {
   name: string;
   abbreviation: string;
   platform: string;
}

export function regionToString(region: string): IRegionToStringResponse {
   const foundRegion = (regions as RegionsJSON).find((r) => r.key === region) ?? {
      key: region,
      name: region,
      abbreviation: region,
      platform: "%",
   };

   return {
      name: foundRegion.name,
      abbreviation: foundRegion.abbreviation,
      platform: foundRegion.platform,
   };
}
