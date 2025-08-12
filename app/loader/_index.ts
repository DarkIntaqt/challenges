import { fetchApi } from "@cgg/utils/api";
import { cdnData, getChampionImage } from "@cgg/utils/cdn";

interface SplashEntry {
   championKey: string;
   type: "centered" | "splash";
   skinId: number;
}

export async function indexLoader() {
   const req = await fetchApi<Record<"months", SplashEntry[]>>(cdnData("home.json"));

   if (req === null) {
      throw new Response("Failed to load home data", { status: 500 });
   }

   const homeData = req;

   const image = homeData.months[new Date().getMonth()];
   const splash = getChampionImage(image.championKey, image.skinId, image.type);

   return { splash };
}
