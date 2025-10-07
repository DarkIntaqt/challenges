import { parse } from "cookie";
import { cookieNames } from "@cgg/config/config";
import type { titleFilter } from "@cgg/routes/titles";
import { getChampions } from "@cgg/utils/endpoints/getStaticData";

export async function titleLoader(request: Request, client: boolean = false) {
   const championData = await getChampions();

   if (championData === null) {
      throw new Response("Champion data unavailable", { status: 503 });
   }

   let filter: titleFilter[] = [];
   let search: string = "";
   let cookie = null;
   if (!client) {
      cookie = request.headers.get("Cookie");
   } else {
      cookie = document.cookie;
   }
   if (cookie) {
      const values = parse(cookie);
      if (values[cookieNames.titleFilter]) {
         try {
            const parsed = JSON.parse(atob(values[cookieNames.titleFilter] ?? "{}"));
            filter = (parsed.filters ?? []) as titleFilter[];
            search = parsed.search ?? "";
         } catch (e) {
            // ignore invalid cookie
         }
      }
   }

   return { championData, filter, search };
}
