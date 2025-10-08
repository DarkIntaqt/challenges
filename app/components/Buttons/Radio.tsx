import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import type { IButtons } from "./Buttons";
import Buttons from "./Buttons";

export default function Radio<T>({
   values,
   state,
   setState,
   column,
}: {
   values: (IButtons<T> | null | undefined)[];
   state: T;
   setState: Dispatch<SetStateAction<T>>;
   column?: boolean;
}) {
   return (
      <Buttons<T>
         buttons={values}
         state={[state]}
         setState={(val) => {
            const nextValue = typeof val === "function" ? val([state]) : val;

            if (nextValue.length === 0) {
               return;
            }

            const newValue = nextValue.filter((x) => x !== state)[0] || state;
            setState(newValue);
         }}
         column={column}
      />
   );
}
