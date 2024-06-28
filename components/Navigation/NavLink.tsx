import Link from "next/link";

import css from "./sidebar.module.scss";
import { useRouter } from "next/router";

export default function NavLink({
   children,
   href,
   ignore = false
}: Readonly<{
   children: React.ReactNode;
   href: string;
   ignore?: boolean;
}>) {
   const router = useRouter();

   return <Link href={href} className={(!ignore && router.pathname === href) ? css.active : ""}>
      {children}
   </Link>;

}
