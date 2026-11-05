import { AdFrame } from "./ad-frame";

export function ResponsiveBanner() {
  return (
    <aside className="ad-slot ad-slot-banner" aria-label="Advertisement" data-ad-slot="banner">
      <span className="ad-label">Advertisement</span>
      <AdFrame kind="banner" />
    </aside>
  );
}
