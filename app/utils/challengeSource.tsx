import { FaAnglesUp, FaBoxOpen, FaPlay, FaRankingStar, FaUser } from "react-icons/fa6";
import clashIcon from "@cgg/assets/clash.svg?no-inline";
import eternalsIcon from "@cgg/assets/eternals.svg?no-inline";
import type { Source } from "./challenges";

export function getChallengeSourceIcon(source: Source) {
   switch (source) {
      case "CHALLENGES":
         return <FaAnglesUp />;
      case "EOGD":
         return <FaPlay />;
      case "ETERNALS":
         return <img src={eternalsIcon} alt="" draggable={false} />;
      case "CLASH":
         return <img src={clashIcon} alt="" draggable={false} />;
      case "CAP_INVENTORY":
         return <FaBoxOpen />;
      case "RANKED":
         return <FaRankingStar />;
      case "SUMMONER":
         return <FaUser />;
      default:
         return null;
   }
}

export function getChallengeSourceName(source: Source): string {
   switch (source) {
      case "CHALLENGES":
         return "Progress";
      case "EOGD":
         return "Ingame";
      case "ETERNALS":
         return "Eternals";
      case "CLASH":
         return "Clash";
      case "CAP_INVENTORY":
         return "Inventory";
      case "RANKED":
         return "Ranked";
      case "SUMMONER":
         return "Profile";
      default:
         return source;
   }
}
