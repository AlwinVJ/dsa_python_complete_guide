import { Link } from "@tanstack/react-router";
import { ListTree, Github, BookOpen, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 mt-16">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-semibold">
              <span className="grid h-8 w-8 place-items-center rounded-md gradient-brand text-primary-foreground">
                <ListTree className="h-4 w-4" />
              </span>
              DSA with Python
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Master Data Structures & Algorithms in Python through interactive visualizations,
              animations, and coding practice.
            </p>
          </div>
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Learn
            </div>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link to="/roadmap" className="hover:text-foreground text-muted-foreground">
                  Roadmap
                </Link>
              </li>
              <li>
                <Link to="/introduction" className="hover:text-foreground text-muted-foreground">
                  Arrays & Lists
                </Link>
              </li>
              <li>
                <Link to="/sorting" className="hover:text-foreground text-muted-foreground">
                  Sorting
                </Link>
              </li>
              <li>
                <Link to="/algorithms" className="hover:text-foreground text-muted-foreground">
                  Algorithms
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Practice
            </div>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link to="/playgrounds" className="hover:text-foreground text-muted-foreground">
                  Playgrounds
                </Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-foreground text-muted-foreground">
                  Practice Problems
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-foreground text-muted-foreground">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Community
            </div>
            <ul className="space-y-1.5 text-sm">
              <li>
                <a
                  href="https://docs.python.org/3/tutorial/datastructures.html"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-foreground text-muted-foreground"
                >
                  <BookOpen className="h-3.5 w-3.5" /> Python Docs
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-foreground text-muted-foreground"
                >
                  <Github className="h-3.5 w-3.5" /> GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-foreground text-muted-foreground"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> Discord
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} DSA with Python. Built for learners, by learners.
        </div>
      </div>
    </footer>
  );
}
