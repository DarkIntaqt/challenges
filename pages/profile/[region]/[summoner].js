import { serversRaw } from "challenges/utils/platform";

export default function Profile({ user = {}, err = {} }) {
   return <span>Profile</span>;
}


Profile.getInitialProps = async (ctx) => {

   const region = ctx.query.region;

   if (!serversRaw.includes(region)) {
      ctx.res.statusCode = 404;
      return {
         err: {
            statusCode: 404,
            message: "Invalid region"
         }
      };
   }

   return {};
};