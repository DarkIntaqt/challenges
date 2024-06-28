export type SidebarConfig = "HIDDEN" | "VISIBLE";

export interface ErrorProps {
   err?: { statusCode: number; message?: any };
}
