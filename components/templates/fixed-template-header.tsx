"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import type { InternalLink } from "@/config/types";
import { assetPath, routePath } from "@/lib/urls";

/** One shared, stable header for the approved fixed directory skin on ALL routes.
 * The original fixed specimen rendered different homepage/inner chrome and
 * crowded the top row with every guide; keep its light/amber visual language.
 */
export function FixedTemplateHeader({ links }: { links: InternalLink[] }) {
  const pathname = usePathname() || "/";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMobileOpen(false); setMoreOpen(false); }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);
  const path = pathname.replace(/\/+$/, "") || "/";
  const active = (slug: string) => (routePath(slug).replace(/\/+$/, "") || "/") === path;
  const guides = links.filter((link) => Boolean(link.slug));
  const primary = guides.slice(0, 3);
  const overflow = guides.slice(3);
  const item = (link: InternalLink, extra = "") => (
    <Link
      key={link.slug}
      href={routePath(link.slug)}
      aria-current={active(link.slug) ? "page" : undefined}
      className={`bw-nav-link ${active(link.slug) ? "bw-current" : ""} ${extra}`}
      onClick={() => { setMobileOpen(false); setMoreOpen(false); }}
    >
      {link.label}
    </Link>
  );
  return (
    <header className="bw-header">
      <div className="bw-header-inner site-container">
        <Link className="bw-brand" href="/" onClick={() => { setMobileOpen(false); setMoreOpen(false); }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={assetPath(siteConfig.assets.logo)} width="38" height="38" alt="" />
          <span>{siteConfig.shortName}</span>
          <span className="bw-brand-suffix">Guide</span>
        </Link>
        <nav className="bw-desktop-nav" aria-label="Primary navigation">
          <Link href="/" aria-current={path === "/" ? "page" : undefined} className={`bw-nav-link ${path === "/" ? "bw-current" : ""}`}>Home</Link>
          {primary.map((link) => item(link))}
          {overflow.length > 0 ? (
            <div className="bw-more-wrap" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setMoreOpen(false); }}>
              <button type="button" className={`bw-nav-link bw-more-button ${overflow.some((l) => active(l.slug)) ? "bw-current" : ""}`} aria-haspopup="true" aria-expanded={moreOpen} aria-controls="bw-more-list" onClick={() => setMoreOpen((v) => !v)}>
                More guides <ChevronDown size={15} aria-hidden="true" />
              </button>
              {moreOpen ? (
                <div id="bw-more-list" className="bw-more-menu" role="group" aria-label="Additional guides">
                  {overflow.map((link) => item(link))}
                </div>
              ) : null}
            </div>
          ) : null}
        </nav>
        <button type="button" className="bw-mobile-toggle" aria-expanded={mobileOpen} aria-controls="bw-mobile-nav" aria-label={mobileOpen ? "Close navigation" : "Open navigation"} onClick={() => setMobileOpen((v) => !v)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />} <span>Menu</span>
        </button>
      </div>
      {mobileOpen ? (
        <nav id="bw-mobile-nav" className="bw-mobile-nav" aria-label="Mobile navigation">
          <Link href="/" className={`bw-nav-link ${path === "/" ? "bw-current" : ""}`} onClick={() => setMobileOpen(false)}>Home</Link>
          {guides.map((link) => item(link))}
        </nav>
      ) : null}
      <div className="bw-gamebar" aria-hidden="true" />
    </header>
  );
}
