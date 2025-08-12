import type { Route } from "./+types/root";
import {
   Links,
   Meta,
   Outlet,
   Scripts,
   ScrollRestoration,
   type ShouldRevalidateFunctionArgs,
   isRouteErrorResponse,
} from "react-router";
import Container from "@cgg/components/Container/Container";
import ErrorWrapper from "@cgg/components/ErrorWrapper/ErrorWrapper";
import Loader from "@cgg/components/Loader/Loader";
import Navigation from "@cgg/components/Navigation/Navigation";
import { usePageTransition } from "@cgg/hooks/usePageTransition";
import { rootLoader } from "@cgg/loader/root";
import { cdnDomain, cupcakeDomain } from "@cgg/utils/cdn";
import "./app.scss";
import { storageNames } from "./config/config";

export const links: Route.LinksFunction = () => [
   {
      rel: "preconnect",
      href: cdnDomain,
   },
   {
      rel: "preconnect",
      href: cupcakeDomain,
   },
];

export function Layout({ children }: { children: React.ReactNode }) {
   return (
      <html lang="en">
         <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <Meta />
            <Links />
            {/* Simplebar is currently not used */}
            {/* <noscript>
               <link rel="stylesheet" href="/no-js.css" />
            </noscript> */}
         </head>
         <body>
            {children}
            <ScrollRestoration />
            <Scripts />
         </body>
      </html>
   );
}

// Black magic
function loaderFunction() {
   return rootLoader();
}

export { loaderFunction as loader, loaderFunction as clientLoader };

// Revalidate every 15 minutes
export const shouldRevalidate = ({}: ShouldRevalidateFunctionArgs) => {
   const revalidate = sessionStorage.getItem(storageNames.revalidate);
   if (!revalidate) {
      sessionStorage.setItem(
         storageNames.revalidate,
         JSON.stringify(Date.now() + 1000 * 60 * 15),
      );
      return false;
   }

   const expiry = JSON.parse(revalidate);
   if (Date.now() > expiry) {
      sessionStorage.setItem(
         storageNames.revalidate,
         JSON.stringify(Date.now() + 1000 * 60 * 15),
      );
      return true;
   }
   return false;
};

export default function App() {
   const { transition, profileNavigation } = usePageTransition();
   return (
      <Navigation>
         {transition && !profileNavigation ? (
            <Container center flex justify fullHeight>
               <Loader />
            </Container>
         ) : (
            <Outlet />
         )}
      </Navigation>
   );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
   let message = "Oops!";
   let details = "An unexpected error occurred.";
   let stack: string | undefined;

   if (isRouteErrorResponse(error)) {
      message = error.status === 404 ? "404" : error.data || "Error";
      details =
         error.status === 404
            ? "The requested page could not be found."
            : error.statusText || details;
   } else if (import.meta.env.DEV && error && error instanceof Error) {
      details = error.message;
      stack = error.stack;
   }

   return (
      <Navigation>
         <ErrorWrapper message={message} details={details} stack={stack} />
      </Navigation>
   );
}
