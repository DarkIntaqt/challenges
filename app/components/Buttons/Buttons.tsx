import clsx from "clsx";
import type { Dispatch, SetStateAction } from "react";
import css from "./buttons.module.scss";

interface IButtons<T> {
   name: string;
   id: T;
}

export default function Buttons<T>({
   buttons,
   state,
   setState,
}: {
   buttons: IButtons<T>[];
   state: T[];
   setState: Dispatch<SetStateAction<T[]>>;
}) {
   function toggle(item: T) {
      setState((prevState) =>
         prevState.includes(item)
            ? prevState.filter((value) => item !== value)
            : [...prevState, item],
      );
   }

   return (
      <div className={css.buttons}>
         {buttons.map((button, i) => {
            return (
               <button
                  className={clsx(css.button, state.includes(button.id) && css.enabled)}
                  key={i}
                  onClick={() => toggle(button.id)}
               >
                  {button.name}
               </button>
            );
         })}
      </div>
   );
}
