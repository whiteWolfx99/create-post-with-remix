import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import Navbar from "./components/Navbar";
import globalStyleUrl from "~/styles/global.css";

// to link css to all jsx file
export const links = () => [{ rel: "stylesheet", href: globalStyleUrl }];

// to add meta tag to all jsx file
export const meta = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

// to add script to all jsx file
function Document({ children }) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Navbar>
        <Outlet />
      </Navbar>
    </Document>
  );
}

export function ErrorBoundary({ error }) {
  console.log(error);
  return (
    <Document>
      <Navbar>
        <div className="error-boundary"> 
        <h1>Something went wrong</h1>
        <p>{error.message}</p>
        </div>
      </Navbar>
    </Document>
  );
}
