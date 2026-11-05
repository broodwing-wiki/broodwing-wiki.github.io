"use client";

import { useEffect } from "react";
import { socialBarCode } from "@/config/adsterra";

export function SocialBar() {
  useEffect(() => {
    // Lives in the persistent root layout; keep the script across route changes.
    if (document.getElementById("adsterra-social-bar")) return;
    const snippet = new DOMParser().parseFromString(socialBarCode, "text/html");
    const official = snippet.querySelector("script")!;
    const script = document.createElement("script");
    for (const attribute of official.attributes) script.setAttribute(attribute.name, attribute.value);
    script.id = "adsterra-social-bar";
    document.body.appendChild(script);
  }, []);
  return null;
}
