"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/config";
import { BlueBugLogo } from "@/components/ui/BlueBugLogo";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="container">
          <nav className="navbar-inner">
            {/* Logo */}
            <Link
              href="/"
              className="logo"
              id="navbar-brand-logo"
              aria-label="BlueBug Home"
            >
              <div id="navbar-brand-icon-target" className="navbar-logo-mark">
                <BlueBugLogo size={46} glow={true} />
              </div>
              <div className="logo-text-group">
                <span className="logo-wordmark">
                  Blue<span className="logo-accent">Bug</span>
                </span>
                <span className="logo-badge">
                  <span className="badge-live-dot" />
                  Engineering &amp; Systems
                </span>
              </div>
            </Link>

            {/* Desktop nav links */}
            <div className="nav-links">
              {NAV_LINKS.map((l) => {
                const isActive =
                  l.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`nav-link ${isActive ? "active" : ""}`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </div>

            {/* Desktop CTA + Mobile hamburger */}
            <div className="nav-actions">
              <Link href="/contact" className="btn btn-primary btn-sm">
                Book a Call
              </Link>
              <button
                className={`nav-hamburger ${mobileOpen ? "open" : ""}`}
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle navigation"
                aria-expanded={mobileOpen}
              >
                <span />
                <span />
                <span />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile drawer */}
      <div className={`nav-drawer ${mobileOpen ? "open" : ""}`} id="mobile-nav-drawer">
        {NAV_LINKS.map((l) => {
          const isActive =
            l.href === "/"
              ? pathname === "/"
              : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`nav-link ${isActive ? "active" : ""}`}
            >
              {l.label}
            </Link>
          );
        })}
        <div style={{ marginTop: "0.75rem" }}>
          <Link href="/contact" className="btn btn-primary" style={{ width: "100%" }}>
            Book a Call
          </Link>
        </div>
      </div>

      {/* Push content below fixed navbar */}
      <div className="navbar-offset" />
    </>
  );
}
