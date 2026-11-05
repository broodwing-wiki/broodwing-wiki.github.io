import { AdFrame } from "./ad-frame";

export function NativeAdSlot() {
  return (
    <aside className="ad-slot ad-slot-native" aria-label="Advertisement" data-ad-slot="native">
      <span className="ad-label">Advertisement</span>
      <AdFrame kind="native" />
    </aside>
  );
}
