import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Menu, X, Moon, Sun, Github, ListTree } from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CourseSidebar } from "../components/CourseSidebar";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          That lesson doesn't exist. Head back to the intro to keep learning.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md gradient-brand px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Try again or go back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-md gradient-brand px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "DSA with Python — Interactive Data Structures & Algorithms" },
      {
        name: "description",
        content:
          "Master Data Structures & Algorithms in Python through interactive visualizations, animations, coding practice, and real-world applications.",
      },
      { property: "og:title", content: "DSA with Python" },
      {
        property: "og:description",
        content:
          "The complete interactive DSA course in Python: arrays, linked lists, trees, graphs, DP, sorting, patterns, and more.",
      },
      { property: "og:site_name", content: "DSA with Python" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("pylist-theme");
    const isDark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("pylist-theme", next ? "dark" : "light");
  };
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background hover:bg-accent transition"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}


function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen">
        <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
          <div className="mx-auto flex h-14 items-center gap-3 px-4">
            <button
              className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-border"
              onClick={() => setMobileOpen((s) => !s)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <span className="grid h-8 w-8 place-items-center rounded-md gradient-brand text-primary-foreground">
                <ListTree className="h-4 w-4" />
              </span>
              <span className="hidden sm:inline">DSA with Python</span>
              <span className="sm:hidden">DSA·Py</span>
            </Link>
            <div className="ml-auto flex items-center gap-2">
              <Link
                to="/playgrounds/sorting"
                className="hidden sm:inline-flex items-center rounded-md gradient-brand px-3 py-1.5 text-xs font-medium text-primary-foreground"
              >
                Playground
              </Link>
              <ThemeToggle />
              <a
                href="https://docs.python.org/3/tutorial/datastructures.html"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border hover:bg-accent"
                aria-label="Python docs"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>
        </header>

        <div className="mx-auto flex w-full">
          <aside className="hidden lg:block sticky top-14 h-[calc(100vh-3.5rem)] w-64 lg:w-72 xl:w-80 shrink-0 border-r border-border">
            <CourseSidebar />
          </aside>

          {mobileOpen && (
            <div className="lg:hidden fixed inset-0 top-14 z-30 bg-background">
              <CourseSidebar onNavigate={() => setMobileOpen(false)} />
            </div>
          )}

          <main className="min-w-0 flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
}
