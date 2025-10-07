import clsx from "clsx";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import css from "./buttons.module.scss";

interface IButtons<T> {
   name: string | ReactNode;
   id: T;
}

export default function Buttons<T>({
   buttons,
   state,
   setState,
   column,
}: {
   buttons: (IButtons<T> | null | undefined)[];
   state: T[];
   setState: Dispatch<SetStateAction<T[]>>;
   column?: boolean;
}) {
   function toggle(item: T) {
      setState((prevState) =>
         prevState.includes(item)
            ? prevState.filter((value) => item !== value)
            : [...prevState, item],
      );
   }

   return (
      <div className={clsx(css.buttons, column && css.column)}>
         {buttons
            .filter((x) => x !== null && x !== undefined)
            .map((button, i) => {
               return (
                  <button
                     className={clsx(
                        css.button,
                        state.includes(button.id) && css.enabled,
                     )}
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
