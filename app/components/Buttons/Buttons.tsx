import clsx from "clsx";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import css from "./buttons.module.scss";

export interface IButton<T> {
   name: string | ReactNode;
   id: T;
}

export type IButtons<T> = IButton<T> | IButton<T>[];

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
               const currentButton = getCurrentButton(button as IButtons<T>, state);
               const nextButton = getNextButton(button as IButtons<T>, state);

               return (
                  <button
                     className={clsx(
                        css.button,
                        state.includes(currentButton.id) && css.enabled,
                     )}
                     key={`${css.buttons}-${i}`}
                     onClick={() => {
                        // Only "select" the next button if the current button is not an array of buttons.
                        if (isButtonArray(button)) {
                           setState((prevState) => {
                              const ids = button.map((x) => x.id);
                              const nextState = prevState.filter((x) => !ids.includes(x));
                              nextState.push(nextButton.id);
                              return nextState;
                           });
                        } else {
                           toggle(nextButton.id);
                        }
                     }}
                  >
                     {nextButton.name}
                  </button>
               );
            })}
      </div>
   );
}

function isButtonArray<T>(button: IButtons<T>): button is IButton<T>[] {
   return Array.isArray(button);
}

function getCurrentButton<T>(button: IButtons<T>, state: T[]): IButton<T> {
   if (!isButtonArray(button)) {
      return button;
   }

   const currentIndex = button.findIndex((x) => state.includes(x.id));
   return button[currentIndex] || button[0];
}

function getNextButton<T>(button: IButtons<T>, state: T[]): IButton<T> {
   if (!isButtonArray(button)) {
      return button;
   }

   const currentIndex = button.findIndex((x) => state.includes(x.id));
   const nextIndex = (currentIndex + 1) % button.length;

   return button[nextIndex];
}
