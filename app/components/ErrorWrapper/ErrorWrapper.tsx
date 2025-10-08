import Container from "@cgg/components/Container/Container";
import Heading from "@cgg/components/Heading/Heading";
import { cdnAssets } from "@cgg/utils/cdn";
import css from "./errorWrapper.module.scss";

export default function ErrorWrapper({
   message,
   details,
   stack,
}: {
   message: string;
   details: string;
   stack?: string;
}) {
   return (
      <Container small center className={css.wrapper}>
         {/* on the left */}
         <div className={css.content}>
            <p className={css.intro}>So, uhm... There was an error...:</p>
            <Heading className={css.message}>{message}</Heading>
            <p className={css.details}>{details}</p>
            {stack && <pre className={css.errorStack}>{stack}</pre>}
         </div>

         {/* on the right */}
         <img src={cdnAssets("art/no-pk")} alt="" />
      </Container>
   );
}
