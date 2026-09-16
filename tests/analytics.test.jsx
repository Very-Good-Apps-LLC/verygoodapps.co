// @vitest-environment-options {"url":"https://verygoodapps.co/"}
import { StrictMode } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import {
  applyConsent,
  measurementId,
  preferenceKey,
  readConsent,
  saveConsent,
} from '../src/analytics';
import AnalyticsConsent from '../src/components/AnalyticsConsent';

beforeEach(() => {
  localStorage.clear();
  history.replaceState(null, '', '/');
  vi.stubEnv('PROD', true);
});
afterEach(() => {
  applyConsent('declined');
  document.getElementById('google-analytics')?.remove();
  delete window.gtag;
  delete window.dataLayer;
  delete window[`ga-disable-${measurementId}`];
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});
const calls = () => (window.dataLayer || []).map((entry) => [...entry]);

test('unknown and declined choices never load Google or queue collection', () => {
  applyConsent(null);
  applyConsent('declined');
  expect(document.querySelector('script[src*="googletagmanager"]')).toBeNull();
  expect(window.dataLayer).toBeUndefined();
});

test('acceptance initializes once with advertising denied and safe page URLs', () => {
  history.replaceState(null, '', '/privacy/?email=private@example.com#secret');
  applyConsent('accepted');
  applyConsent('accepted');
  expect(document.querySelectorAll('#google-analytics')).toHaveLength(1);
  const configs = calls().filter(([command]) => command === 'config');
  expect(configs).toHaveLength(1);
  expect(configs[0]).toEqual([
    'config',
    measurementId,
    expect.objectContaining({
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: 'https://verygoodapps.co/privacy/',
      cookie_expires: 15552000,
      cookie_update: false,
    }),
  ]);
  expect(calls()[0]).toEqual([
    'consent',
    'default',
    {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    },
  ]);
  expect(JSON.stringify(calls())).not.toContain('private@example.com');
});

test('arbitrary missing URLs are grouped without sending their path', () => {
  history.replaceState(null, '', '/private-token');
  applyConsent('accepted');
  expect(calls().find(([command]) => command === 'config')[2].page_location).toBe(
    'https://verygoodapps.co/404.html',
  );
});

test('development builds and other hosts do not initialize analytics', () => {
  vi.stubEnv('PROD', false);
  applyConsent('accepted');
  expect(window.gtag).toBeUndefined();
  vi.stubEnv('PROD', true);
  vi.stubGlobal('location', { hostname: '127.0.0.1' });
  applyConsent('accepted');
  expect(window.gtag).toBeUndefined();
  vi.unstubAllGlobals();
});

test('withdrawing consent disables collection and clears only our analytics cookies', () => {
  applyConsent('accepted');
  document.cookie = 'vga_ga=test; Path=/; Domain=verygoodapps.co; Secure';
  document.cookie = 'vga_ga_1WYH706CWZ=session; Path=/; Secure';
  document.cookie = 'unrelated=keep; Path=/; Secure';
  applyConsent('declined');
  expect(window[`ga-disable-${measurementId}`]).toBe(true);
  expect(document.cookie).not.toContain('vga_ga');
  expect(document.cookie).toContain('unrelated=keep');
  document.cookie = 'unrelated=; Max-Age=0; Path=/; Secure';
});

test('expired, malformed, or unavailable saved consent defaults to no consent', () => {
  saveConsent('accepted');
  expect(readConsent()).toBe('accepted');
  localStorage.setItem(
    preferenceKey,
    JSON.stringify({ choice: 'accepted', expires: Date.now() - 1 }),
  );
  expect(readConsent()).toBeNull();
  localStorage.setItem(preferenceKey, 'broken');
  expect(readConsent()).toBeNull();
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new Error('blocked');
  });
  expect(readConsent()).toBeNull();
});

test('visitors can decline, reopen settings, accept, and withdraw', () => {
  render(
    <StrictMode>
      <AnalyticsConsent />
    </StrictMode>,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Decline', exact: true }));
  expect(readConsent()).toBe('declined');
  expect(window.gtag).toBeUndefined();
  fireEvent.click(screen.getByRole('button', { name: 'Analytics settings' }));
  expect(screen.getByRole('button', { name: 'Decline' })).toHaveFocus();
  fireEvent.click(screen.getByRole('button', { name: 'Accept', exact: true }));
  expect(readConsent()).toBe('accepted');
  expect(calls().filter(([command]) => command === 'config')).toHaveLength(1);
  fireEvent.click(screen.getByRole('button', { name: 'Analytics settings' }));
  fireEvent.click(screen.getByRole('button', { name: 'Decline', exact: true }));
  expect(window[`ga-disable-${measurementId}`]).toBe(true);
  expect(screen.getByRole('button', { name: 'Analytics settings' })).toHaveFocus();
});

test('a choice changed in another tab stops collection in this tab', () => {
  saveConsent('accepted');
  render(<AnalyticsConsent />);
  expect(window[`ga-disable-${measurementId}`]).toBe(false);
  saveConsent('declined');
  act(() => window.dispatchEvent(new StorageEvent('storage', { key: preferenceKey })));
  expect(window[`ga-disable-${measurementId}`]).toBe(true);
});
