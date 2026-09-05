"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/config";
import { BlueBugLogo } from "@/components/ui/BlueBugLogo";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="container">
          <nav className="navbar-inner">
            {/* Logo with pure vector emblem (zero white background) */}
            <Link
              href="/"
              className="logo"
              id="navbar-brand-logo"
              aria-label="BlueBug Home"
            >
              <div id="navbar-brand-icon-target" className="navbar-logo-mark">
                <BlueBugLogo size={48} glow={true} />
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

            {/* Nav links */}
            <div className="nav-links">
              {NAV_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="nav-link">
                  {l.label}
                </Link>
              ))}
            </div>

            {/* CTA */}
            <div className="nav-actions">
              <Link href="/contact" className="btn btn-primary btn-sm">
                Book a Call
              </Link>
            </div>
          </nav>
        </div>
      </header>
      {/* Push content below fixed navbar */}
      <div className="navbar-offset" />
    </>
  );
}
