import { useRef, useState } from 'react';
import { KeepTogether } from '../Text';

const columns = 12;
const rows = 8;
const inks = [
  { name: 'Paper', value: '#fff5df' },
  { name: 'Rust', value: '#a64f35' },
  { name: 'Olive', value: '#667451' },
  { name: 'Blue', value: '#536d7b' },
];

export default function DrawingGrid() {
  const [pixels, setPixels] = useState(() => Array(columns * rows).fill(0));
  const [ink, setInk] = useState(1);
  const [cursor, setCursor] = useState(0);
  const cells = useRef([]);
  const drag = useRef(null);
  const lastPointer = useRef('');

  const paint = (index, color = ink) =>
    setPixels((previous) => {
      if (previous[index] === color) return previous;
      const next = [...previous];
      next[index] = color;
      return next;
    });
  const pixelAt = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    return x >= 0 && x < 1 && y >= 0 && y < 1
      ? Math.floor(y * rows) * columns + Math.floor(x * columns)
      : null;
  };
  const start = (event) => {
    lastPointer.current = event.pointerType;
    // Finger swipes remain native scrolling; a completed tap paints one square.
    if (event.pointerType === 'touch' || event.button !== 0) return;
    const index = pixelAt(event);
    if (index === null) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { id: event.pointerId, index };
    cells.current[index].focus({ preventScroll: true });
    paint(index);
  };
  const move = (event) => {
    if (!drag.current || drag.current.id !== event.pointerId) return;
    const index = pixelAt(event);
    if (index === null) return;
    const before = drag.current.index;
    const x = before % columns,
      y = Math.floor(before / columns);
    const dx = (index % columns) - x,
      dy = Math.floor(index / columns) - y;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));
    setPixels((previous) => {
      const next = [...previous];
      for (let step = 0; step <= steps; step++) {
        next[
          Math.round(y + (dy * step) / (steps || 1)) * columns +
            Math.round(x + (dx * step) / (steps || 1))
        ] = ink;
      }
      return next;
    });
    drag.current.index = index;
  };
  const keys = (event, index) => {
    const x = index % columns,
      y = Math.floor(index / columns);
    const positions = {
      ArrowLeft: y * columns + Math.max(0, x - 1),
      ArrowRight: y * columns + Math.min(columns - 1, x + 1),
      ArrowUp: Math.max(0, y - 1) * columns + x,
      ArrowDown: Math.min(rows - 1, y + 1) * columns + x,
      Home: y * columns,
      End: y * columns + columns - 1,
    };
    if (event.key in positions) {
      event.preventDefault();
      cells.current[positions[event.key]].focus();
    }
    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      paint(index, 0);
    }
  };

  return (
    <>
      <p id="office-drawing-help" className="office-drawing-help">
        <KeepTogether>Pick a color.</KeepTogether> <KeepTogether>Tap a square.</KeepTogether>{' '}
        <KeepTogether>See where it goes.</KeepTogether>
      </p>
      <div className="office-drawing-tools" role="group" aria-label="Drawing tools">
        {inks.slice(1).map((color, index) => (
          <button
            key={color.name}
            type="button"
            aria-label={color.name}
            aria-pressed={ink === index + 1}
            onClick={() => setInk(index + 1)}
          >
            <span style={{ background: color.value }} aria-hidden="true" />
          </button>
        ))}
        <button type="button" aria-pressed={ink === 0} onClick={() => setInk(0)}>
          Eraser
        </button>
        <button
          type="button"
          disabled={!pixels.some(Boolean)}
          onClick={() => setPixels(Array(columns * rows).fill(0))}
        >
          <KeepTogether>Start over</KeepTogether>
        </button>
      </div>
      <p className="office-sr" id="office-drawing-keys">
        Arrow keys move between squares. Space or Enter draws. Delete erases. Finger swipes scroll.
      </p>
      <div
        className="office-drawing-grid"
        role="grid"
        aria-label="Little drawing surface"
        aria-describedby="office-drawing-help office-drawing-keys"
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
        onLostPointerCapture={() => {
          drag.current = null;
        }}
      >
        {Array.from({ length: rows }, (_, row) => (
          <div role="row" key={row}>
            {Array.from({ length: columns }, (_, column) => {
              const index = row * columns + column;
              return (
                <button
                  type="button"
                  role="gridcell"
                  key={column}
                  ref={(element) => {
                    cells.current[index] = element;
                  }}
                  tabIndex={cursor === index ? 0 : -1}
                  onFocus={() => setCursor(index)}
                  onKeyDown={(event) => keys(event, index)}
                  aria-label={`Row ${row + 1}, column ${column + 1}: ${inks[pixels[index]].name}`}
                  style={{ background: inks[pixels[index]].value }}
                  onClick={(event) => {
                    if (event.detail === 0 || lastPointer.current === 'touch') paint(index);
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}
