// Retain old product/privacy and review bookmarks without shipping a router.
export function legacyDestination(hash) {
  const route = hash.split('?')[0];
  if (
    /^#\/(privacy|privacy-policy)\/?$/.test(route) ||
    /^#\/concept\/[^/]+\/privacy\/?$/.test(route)
  )
    return '/privacy/';
  if (route === '#/' || /^#\/concept\/[^/]+\/?$/.test(route)) return '/';
  return null;
}
