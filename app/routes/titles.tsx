import Container from "@cgg/components/Container/Container";
import Heading from "@cgg/components/Heading/Heading";
import { useStaticData } from "@cgg/hooks/useStaticData";
import css from "@cgg/styles/titles.module.scss";

export default function Titles() {
   const data = useStaticData();
   const titles = data.titles;

   console.log(titles);

   return (
      <Container center headerPadding className={css.titlesContainer}>
         <div className={css.head}>
            <Heading>All Titles</Heading>
            <p>
               A list of all League of Legends Title Challenges and how to achieve them
            </p>
         </div>
      </Container>
   );
}
