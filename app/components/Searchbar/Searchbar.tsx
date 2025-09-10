import clsx from "clsx";
import { nanoid } from "nanoid";
import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import css from "./searchbar.module.scss";

export default function Searchbar({
   placeholder,
   value,
   onChange,
}: {
   placeholder?: string;
   value?: string;
   onChange: Dispatch<SetStateAction<string>>;
}) {
   const id = useMemo(() => nanoid(), []);

   const [focus, setFocus] = useState(false);

   return (
      <div className={clsx(css.searchbar, focus && css.focus)}>
         <label htmlFor={id}>
            <FaSearch />
         </label>
         <input
            id={id}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
         />
      </div>
   );
}
