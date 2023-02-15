import css from "challenges/styles/loader.module.scss";

/**
 * Simple Loading component which can be styled afterwards
 * @param {props} props 
 * @returns Loader Component
 */
export default function Loader(props) {
   return <div {...props} className={css.loader}></div>;
}