/**
 * The site's single Google Tag Manager container, placed once in the shared
 * root <head>. The old G- measurement snippet is intentionally not loaded;
 * GA4 measurement is now configured inside GTM-5S8GVBN4.
 */
export function Analytics() {
  return (
    <>
      <script async src="https://www.googletagmanager.com/gtm.js?id=GTM-5S8GVBN4" />
      <script dangerouslySetInnerHTML={{ __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
      ` }} />
    </>
  );
}
