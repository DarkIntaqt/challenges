import { Property } from "csstype";
import { ReactNode } from "react";

import VerifiedIcon from "challenges/assets/verified.svg";

export default function VipBadge({ size = "20px", position = "relative", verified = false }: VipBadgeProps): ReactNode {
   return (
      <VerifiedIcon
         style={{
            height: `calc(0.7 * ${size})`,
            width: `calc(0.7 * ${size})`,
            borderRadius: "50%",
            top: "0",
            left: "0",
            filter: verified ? "" : "grayscale(100%)",
            position: position,
         }}
      />
   );
}

interface VipBadgeProps {
   size?: string;
   position?: Property.Position;
   verified?: boolean;
}
