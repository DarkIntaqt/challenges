import { Property } from "csstype";
import Image from "next/image";
import { ReactNode } from "react";

export default function VipBadge({
   size = "20px",
   position = "relative",
   margin = "0 5px",
   filter = "",
   alt = "",
}: VipBadgeProps): ReactNode {
   return (
      <Image
         src="https://cdn.darkintaqt.com/lol/static/challenges/verified.png"
         width={32}
         height={32}
         style={{
            height: `calc(0.7 * ${size})`,
            width: `calc(0.7 * ${size})`,
            borderRadius: "50%",
            margin: margin,
            top: "0",
            left: "0",
            filter: filter,
            position: position,
         }}
         alt={alt}
      />
   );
}

interface VipBadgeProps {
   size?: string;
   position?: Property.Position;
   margin?: string;
   filter?: string;
   alt?: string;
}
