"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { desktopBannerCode, mobileBannerCode, nativeBannerCode } from "@/config/adsterra";

/** A fresh document preserves the vendor's parser/document.write semantics and
 * confines ad globals and late script callbacks to the current page visit. */
export function AdFrame({ kind }: { kind: "banner" | "native" }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let observer: ResizeObserver | undefined;
    // React's development effect replay must not execute vendor code twice.
    const timer = window.setTimeout(() => {
      const mobile = !window.matchMedia("(min-width: 768px)").matches;
      const frame = document.createElement("iframe");
      frame.title = kind === "banner" ? "Advertisement banner" : "Advertisement native";
      frame.className = "ad-frame";
      frame.dataset.adFormat = kind === "native" ? "native" : mobile ? "320x50" : "728x90";
      frame.style.width = kind === "native" ? "100%" : mobile ? "320px" : "728px";
      frame.style.height = kind === "native" ? "120px" : mobile ? "50px" : "90px";
      if (kind === "native") {
        frame.onload = () => {
          const body = frame.contentDocument?.body;
          if (!body) return;
          observer = new ResizeObserver(() => {
            frame.style.height = `${Math.max(120, Math.ceil(body.getBoundingClientRect().height))}px`;
          });
          observer.observe(body);
        };
      }
      const code = kind === "native" ? nativeBannerCode : mobile ? mobileBannerCode : desktopBannerCode;
      frame.srcdoc = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0}body{display:flow-root}</style></head><body>${code}</body></html>`;
      host.replaceChildren(frame);
    }, 0);
    return () => {
      window.clearTimeout(timer);
      observer?.disconnect();
      host.replaceChildren();
    };
  }, [kind, pathname]);

  return <div ref={hostRef} className={`ad-host ad-host-${kind}`} data-ad-host={kind} />;
}
