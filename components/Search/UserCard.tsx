import Tilt from "react-parallax-tilt";

import css from "./card.module.scss";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ContentService from "challenges/services/ContentService";
import UserService from "challenges/services/UserService";

export type LookupResponse = {
   playerId: string;
   name: string;
   tag: string;
   level: number;
   icon: number;
}

export type ErrorResponse = {
   status: StatusResponse;
};

export type StatusResponse = {
   message: string;
   status_code: number;
};

export type ResultEntry = {
   name: string;
   tag: string;
}

export default function UserCard({ input, userRegion }: Readonly<{ input: string, userRegion: string }>) {

   const contentService = new ContentService();
   const userService = new UserService();

   const [icon, setIcon] = useState(29);
   const [name, setName] = useState(input);
   const [region, setRegion] = useState(userRegion);

   const [lookup, setLookup] = useState("");
   const [error, setError] = useState(false);
   const [loaded, setLoaded] = useState(false);

   const [lookupName, setLookupName] = useState(name);

   const router = useRouter();

   useEffect(() => {
      if (lookupName !== input || region !== userRegion) {
         setIcon(29);
         setName(input);
         setLookupName(input);
         setLookup("");
         setError(false);
         setLoaded(false);
         setRegion(userRegion);
      } else {
         if (lookup !== name + userRegion) {
            setTimeout(() => {
               setLookup(name + userRegion);
            }, 400);
         } else {
            fetchPlayerData();
         }
      }

      async function fetchPlayerData() {
         try {
            if (lookupName.length > 1) {
               const summoner = await userService.checkUser(lookupName, region);

               if (summoner === undefined) {
                  setError(true);
                  return;
               };

               setIcon(summoner.icon);
               setName(summoner.name + "#" + summoner.tag);
               setError(false);
            }
         } catch (e) {
            setError(true);
         }

         setLoaded(true);
      }

      // disabling eslint check here as userService will not change
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [name, lookupName, lookup, region, userRegion, input]);

   function search() {
      router.push(`/profile/${region.toLowerCase()}/${lookupName.replace("#", "-")}`);
   }

   return <Tilt
      tiltReverse={true}
      tiltMaxAngleX={5}
      tiltMaxAngleY={5}
      tiltEnable={false}
      glareEnable={true}
      glareMaxOpacity={0.25}
      glareBorderRadius={"8px"}
      scale={1.02}
      className={css.result}>
      <div onClick={search} className={`${css.content} ${error ? css.error : null}`}>

         <div className={css.bg}>
            <Image
               src={contentService.getProfileIcon(icon)}
               alt=""
               height={64}
               width={64}
            />
         </div>

         <div className={`${css.loader} ${(!loaded && !error) ? css.loading : css.loaded}`}>
            <Image
               src={contentService.getProfileIcon(icon)}
               alt=""
               height={64}
               width={64}
            />
         </div>

         <p>{name} <span>{userRegion}</span></p>

      </div>
   </Tilt>;
}
