import { useEffect, useRef, useState } from 'react';
import DrawingGrid from './DrawingGrid';

export default function DrawingDialog({ open, onClose, triggerRef }) {
  const dialog = useRef(null);
  const closeButton = useRef(null);
  const closeTimer = useRef(null);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!open) return;
    const node = dialog.current;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    node.showModal();
    const from = trigger.getBoundingClientRect();
    const to = node.getBoundingClientRect();
    node.style.setProperty('--from-x', `${from.left + from.width / 2 - to.left - to.width / 2}px`);
    node.style.setProperty('--from-y', `${from.top + from.height / 2 - to.top - to.height / 2}px`);
    closeButton.current.focus();
    return () => {
      clearTimeout(closeTimer.current);
      node.close();
      document.body.style.overflow = previousOverflow;
      trigger?.focus({ preventScroll: true });
    };
  }, [open, triggerRef]);

  const finishClosing = () => {
    setClosing(false);
    onClose();
  };
  const close = () => {
    if (closing) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finishClosing();
    } else {
      setClosing(true);
      closeTimer.current = setTimeout(finishClosing, 190);
    }
  };

  const keepFocusInside = (event) => {
    if (event.key !== 'Tab') return;
    const stops = [...dialog.current.querySelectorAll('button:not(:disabled)')].filter(
      (button) => button.tabIndex >= 0,
    );
    const first = stops[0];
    const last = stops.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  // Remain mounted so the drawing survives closing and reopening the dialog.
  return (
    <dialog
      ref={dialog}
      className={`office-drawing-window${open ? ' is-open' : ''}${closing ? ' is-closing' : ''}`}
      aria-labelledby="office-drawing-title"
      onKeyDown={keepFocusInside}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
    >
      <div className="office-drawing-titlebar">
        <h2 id="office-drawing-title">Draw a little.</h2>
        <button ref={closeButton} type="button" aria-label="Close drawing surface" onClick={close}>
          ×
        </button>
      </div>
      <DrawingGrid />
    </dialog>
  );
}
