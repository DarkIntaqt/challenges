import { Link } from "react-router";
import Container from "@cgg/components/Container/Container";
import regions from "@cgg/config/json/regions.json";
import type { RegionsJSON } from "@cgg/config/json/regions.types";
import css from "./leaderboard.layout.module.scss";

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
   return (
      <Container center headerPadding className={css.container}>
         {(regions as RegionsJSON).map((region) => (
            <Link
               key={region.key}
               to={`?region=${region.key}`}
               className={css.regionLink}
            >
               {region.abbreviation}
            </Link>
         ))}
         {children}
      </Container>
   );
}
