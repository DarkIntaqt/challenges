"use client";

import { useRouter } from "next/navigation";
import Searchbar from "./Searchbar";

export default function SearchbarHOC() {

   const router = useRouter();

   return <Searchbar router={router}></Searchbar>;

}