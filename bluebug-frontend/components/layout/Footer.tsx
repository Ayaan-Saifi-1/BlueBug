import Link from "next/link";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/config";
import { BlueBugLogo } from "@/components/ui/BlueBugLogo";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <Link href="/" className="logo" aria-label="BlueBug Home">
              <div className="navbar-logo-mark">
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
            <p className="footer-brand-desc">
              A tech consultancy building custom sites, apps, and AI/ML systems that actually ship.
            </p>
          </div>

          {/* Explore */}
          <div className="footer-col">
            <h5>Explore</h5>
            <div className="footer-col-links">
              {NAV_LINKS.map((l) => (
                <Link key={l.href} href={l.href}>{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div className="footer-col">
            <h5>Connect</h5>
            <div className="footer-col-links">
              <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>
              <a href={SITE_CONFIG.github} target="_blank" rel="noopener noreferrer">GitHub</a>
              <Link href="/privacy">Privacy Policy</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.</span>
          <Link href="/privacy">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
