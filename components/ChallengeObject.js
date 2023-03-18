import css from "challenges/styles/challengeObject.module.scss";
import Image from "next/image";
import Link from "next/link";

/**
 * @typedef ChallengeProps
 * @type {Object}
 * @property {ChallengeDto} challenge
 */


/**
 * @param {ChallengeProps} props
 */
export default function ChallengeObject({ challenge }) {

   return <Link
      href={`/challenges/${challenge.id}`}
      className={css.challenge}>

      <Image
         src={`https://lolcdn.darkintaqt.com/cdn/np-token/${challenge.id}`}
         alt={challenge.name}
         height={40}
         width={40}
         loading="lazy"
         unoptimized
      />

      <div className={css.title}>
         <p>{challenge.name}</p>
      </div>

   </Link>;

}