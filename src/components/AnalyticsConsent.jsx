import { useEffect, useRef, useState } from 'react';
import { applyConsent, preferenceKey, readConsent, saveConsent } from '../analytics';

export default function AnalyticsConsent() {
  const [choice, setChoice] = useState(readConsent);
  const [editing, setEditing] = useState(false);
  const settings = useRef(null);
  const decline = useRef(null);

  useEffect(() => {
    applyConsent(choice);
  }, [choice]);
  useEffect(() => {
    const sync = (event) => {
      if (event.key === preferenceKey || event.key === null) setChoice(readConsent());
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  useEffect(() => {
    if (editing) decline.current?.focus();
  }, [editing]);

  const choose = (next) => {
    saveConsent(next);
    // Stop collection immediately when withdrawing consent.
    applyConsent(next);
    setChoice(next);
    setEditing(false);
    settings.current?.focus({ preventScroll: true });
  };

  return (
    <>
      <button
        className="analytics-settings"
        id="analytics-settings"
        ref={settings}
        type="button"
        aria-expanded={editing || !choice}
        aria-controls={editing || !choice ? 'analytics-notice' : undefined}
        onClick={() => setEditing(true)}
      >
        Analytics settings
      </button>
      {(editing || !choice) && (
        <aside id="analytics-notice" className="analytics-notice" aria-labelledby="analytics-title">
          <h2 id="analytics-title">A note about analytics</h2>
          <p>
            May we use Google Analytics cookies to understand visits to this site? It’s optional.
            <span> </span>
            <a href="/privacy/">Privacy details</a>
          </p>
          <div className="analytics-actions">
            <button type="button" ref={decline} onClick={() => choose('declined')}>
              Decline
            </button>
            <button type="button" onClick={() => choose('accepted')}>
              Accept
            </button>
            {choice && (
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  settings.current?.focus();
                }}
              >
                Close
              </button>
            )}
          </div>
        </aside>
      )}
    </>
  );
}
