import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

import css from "./sidebar.module.scss";

export default function NavLinkApp({ children, href, ignore = false }: NavLinkProps) {
   const router = usePathname();
   return (
      <Link
         href={href}
         className={!ignore && router === href ? css.active : ""}>
         {children}
      </Link>
   );
}

interface NavLinkProps {
   children: ReactNode;
   href: string;
   ignore?: boolean;
}
