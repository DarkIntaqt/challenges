import css from "challenges/styles/challengeObject.module.scss";
import Image from "next/image";
import Link from "next/link";

/**
 * @typedef ChallengeProps
 * @type {Object}
 *
 * @property {Number} id
 * @property {String} image
 * @property {String} title
 * @property {String} subtitle
 * @property {String} type
 * @property {String} description
 * @property {Boolean} showType - default: false
 * @property {Array} apply
 * 
 */


/**
 * @param {ChallengeProps} props
 */
export default function ChallengeObject({ id, image, title = "", subtitle = "", type = "", description = "", showType = false, apply = [0] }) {

   return <Link
      key={id}
      href={`/challenges/${id}`}
      className={`${css.challenge} ${type}`}>

      <Image
         src={image}
         alt={title}
         height={40}
         width={40}
         loading="lazy"
         unoptimized
      />

      <div className={css.title}>
         <p>{title}</p>
         <span>{subtitle}</span>
      </div>

      <div className={css.description}>
         <p>{description}</p>
      </div>


      {showType === true ? <div className={css.type}>
         <p>{type}</p>
      </div> : <></>}
   </Link>;

}