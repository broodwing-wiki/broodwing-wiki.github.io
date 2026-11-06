import { desktopBannerCode, mobileBannerCode, nativeBannerCode } from "@/config/adsterra";

// Render the provider's original code into the HTML stream instead of an
// iframe srcdoc. Banner vendors may use document.write, so their scripts must
// run during document parsing, not after client-side script injection.
// Only one banner variant is written, based on viewport width.
// Native ads are likewise placed in the document body at the actual ad slot.
const mobileMarkup = JSON.stringify(mobileBannerCode).replace(/<\\//g, "<\\/");
const desktopMarkup = JSON.stringify(desktopBannerCode).replace(/<\\//g, "<\\/");

const responsiveBannerMarkup = `<script>
(function () {
  var mobile = window.matchMedia("(max-width: 767px)").matches;
  document.write(mobile ? ${mobileMarkup} : ${desktopMarkup});
})();
</script>`;

export function AdFrame({ kind }: { kind: "banner" | "native" }) {
  return (
    <div
      className={`ad-host ad-host-${kind}`}
      data-ad-host={kind}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: kind === "native" ? nativeBannerCode : responsiveBannerMarkup,
      }}
    />
  );
}
