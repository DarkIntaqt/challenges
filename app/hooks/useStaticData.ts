import type { Route } from "../+types/root";
import { useRouteLoaderData } from "react-router";

export function useStaticData() {
   const rootData = useRouteLoaderData("root");
   return rootData.staticData as Route.ComponentProps["loaderData"]["staticData"];
}
