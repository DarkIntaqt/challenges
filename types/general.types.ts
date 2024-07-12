export type ThresholdType =
   | "IRON"
   | "BRONZE"
   | "SILVER"
   | "GOLD"
   | "PLATINUM"
   | "DIAMOND"
   | "MASTER"
   | "GRANDMASTER"
   | "CHALLENGER";

export type SidebarConfig = "HIDDEN" | "VISIBLE";

export interface ErrorProps {
   err?: { statusCode: number; message?: any };
}

export type KeysOfType<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T];
