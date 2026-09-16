// Public GA4 measurement ID, not a credential.
export const measurementId = 'G-1WYH706CWZ';
export const preferenceKey = 'vga-analytics-consent-v1';
const lifetime = 180 * 24 * 60 * 60;
const disabledKey = `ga-disable-${measurementId}`;

export function readConsent() {
  try {
    const saved = JSON.parse(localStorage.getItem(preferenceKey));
    if (
      ['accepted', 'declined'].includes(saved?.choice) &&
      Number.isFinite(saved.expires) &&
      saved.expires > Date.now()
    )
      return saved.choice;
  } catch {
    // Blocked or malformed storage leaves analytics off until a new choice.
  }
  return null;
}

export function saveConsent(choice) {
  try {
    localStorage.setItem(
      preferenceKey,
      JSON.stringify({
        choice,
        expires: Date.now() + lifetime * 1000,
      }),
    );
  } catch {
    // The choice still applies to this page when storage is unavailable.
  }
}

function clearAnalyticsCookies() {
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.trim().split('=')[0];
    if (!/^vga_ga(?:_|$)/.test(name)) continue;
    for (const domain of ['', '; Domain=verygoodapps.co', '; Domain=www.verygoodapps.co']) {
      document.cookie = `${name}=; Max-Age=0; Path=/${domain}; SameSite=Lax; Secure`;
    }
  }
}

export function applyConsent(choice) {
  // Never send development, preview-host, or local-network traffic to GA.
  if (
    !import.meta.env.PROD ||
    !['verygoodapps.co', 'www.verygoodapps.co'].includes(location.hostname)
  )
    return;

  if (choice !== 'accepted') {
    window[disabledKey] = true;
    if (window.gtag) window.gtag('consent', 'update', { analytics_storage: 'denied' });
    clearAnalyticsCookies();
    return;
  }

  window[disabledKey] = false;
  if (document.getElementById('google-analytics')) {
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  window.gtag('consent', 'update', { analytics_storage: 'granted' });
  window.gtag('js', new Date());
  // Report known pages only; omit query strings, fragments, and arbitrary 404 paths.
  const path = ['/', '/index.html'].includes(location.pathname)
    ? '/'
    : ['/privacy', '/privacy/', '/privacy/index.html'].includes(location.pathname)
      ? '/privacy/'
      : '/404.html';
  let referrer = '';
  try {
    referrer = new URL(document.referrer).origin;
  } catch {
    /* No referring site. */
  }
  window.gtag('config', measurementId, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    page_location: location.origin + path,
    page_referrer: referrer,
    cookie_prefix: 'vga',
    cookie_domain: 'verygoodapps.co',
    cookie_expires: lifetime,
    cookie_update: false,
    cookie_flags: 'SameSite=Lax;Secure',
  });
  const script = document.createElement('script');
  script.id = 'google-analytics';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.append(script);
}
