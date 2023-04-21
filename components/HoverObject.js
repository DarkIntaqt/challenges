import css from "challenges/styles/hoverObject.module.scss";

export default function HoverObject({ children, hover = [], style = {} }) {

   return <div className={css.hoverObject} style={style}>

      <div className={css.onHover}>{hover}</div>

      {children}

   </div>;

}