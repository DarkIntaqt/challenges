import ErrorPage from "challenges/components/ErrorPage";
import UserService from "challenges/services/UserService";
import getPlatform, { serversBeautified } from "challenges/utils/platform";

export default function Profile({ user = {}, err }) {

   if (err) {
      return <ErrorPage></ErrorPage>;
   }

   return <span>Profile</span>;
}


Profile.getInitialProps = async (ctx) => {

   const region = ctx.query.region;

   if (!serversBeautified.includes(region)) {
      ctx.res.statusCode = 404;
      return {
         err: {
            statusCode: 404,
            message: "Invalid region"
         }
      };
   }

   try {

      const userService = new UserService();

      const user = await userService.getUser(ctx.query.summoner, getPlatform(ctx.query.region));

      return {
         user
      };

   } catch (e) {

      return {
         err: {
            statusCode: 404,
            message: "Summoner not found"
         }
      };

   }

};