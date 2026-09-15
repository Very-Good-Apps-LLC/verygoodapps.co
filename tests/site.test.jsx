import { StrictMode } from 'react';
import userEvent from '@testing-library/user-event';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import App from '../src/App';
import { legacyDestination } from '../src/legacyLinks';

const home = () =>
  render(
    <StrictMode>
      <App pathname="/" />
    </StrictMode>,
  );
const openDrawing = () =>
  fireEvent.click(screen.getByRole('button', { name: 'Draw on the computer' }));

test('homepage retains approved identity and real links without gallery controls', () => {
  home();
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
    'A curious, little, software company.',
  );
  expect(screen.getByRole('main')).toHaveTextContent('Billy Collins and Rafał Truszkowski');
  expect(screen.getByRole('main')).not.toHaveTextContent(/client work|Ruby/);
  expect(screen.getByRole('link', { name: 'Privacy', exact: true })).toHaveAttribute(
    'href',
    '/privacy/',
  );
  expect(screen.getByRole('link', { name: 'Contact', exact: true })).toHaveAttribute(
    'href',
    'mailto:contact@verygoodapps.co',
  );
  expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
});

test('privacy and unknown paths have their own pages', () => {
  const { rerender } = render(<App pathname="/privacy/" />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Privacy.');
  expect(screen.getByRole('main')).toHaveTextContent('We don’t receive your drawings');
  expect(screen.getByRole('link', { name: '← Back to the company' })).toHaveAttribute('href', '/');
  expect(screen.queryByRole('button', { name: 'Draw on the computer' })).not.toBeInTheDocument();
  rerender(<App pathname="/does-not-exist" />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Page not found.');
});

describe('existing bookmarks', () => {
  test.each(['#/privacy', '#/privacy-policy', '#/concept/office-revisited/privacy?solo=1'])(
    '%s reaches company privacy',
    (hash) => {
      expect(legacyDestination(hash)).toBe('/privacy/');
    },
  );
  test.each(['#/', '#/concept/office', '#/concept/office-revisited?solo=1'])(
    '%s reaches home',
    (hash) => {
      expect(legacyDestination(hash)).toBe('/');
    },
  );
  test('ordinary anchors and external-looking fragments are left alone', () => {
    expect(legacyDestination('#main')).toBeNull();
    expect(legacyDestination('#//example.com')).toBeNull();
  });
});

test('lamps wait for the image, stay synchronized, and fall back safely on failure', () => {
  const { container } = home();
  const [left, right] = screen.getAllByRole('switch');
  expect(left).toBeDisabled();
  fireEvent.load(container.querySelector('.office-evening'));
  fireEvent.click(left);
  expect(left).toBeChecked();
  expect(right).toBeChecked();
  expect(screen.getByRole('img', { name: /An imagined miniature/ })).toHaveAttribute(
    'alt',
    expect.stringContaining('dusk'),
  );
  fireEvent.click(right);
  expect(left).not.toBeChecked();
  fireEvent.error(container.querySelector('.office-evening'));
  expect(screen.queryAllByRole('switch')).toHaveLength(0);
  expect(screen.getByRole('img', { name: /An imagined miniature/ })).toHaveAttribute(
    'src',
    '/images/office/day.webp',
  );
});

test('drawing supports colors, erasing, close/reopen persistence, Escape, and focus return', async () => {
  home();
  const trigger = screen.getByRole('button', { name: 'Draw on the computer' });
  openDrawing();
  expect(document.body.style.overflow).toBe('hidden');
  expect(screen.getByRole('button', { name: 'Close drawing surface' })).toHaveFocus();
  fireEvent.click(screen.getByRole('gridcell', { name: 'Row 1, column 1: Paper' }));
  fireEvent.click(screen.getByRole('button', { name: 'Blue', exact: true }));
  fireEvent.click(screen.getByRole('gridcell', { name: 'Row 1, column 2: Paper' }));
  fireEvent.click(screen.getByRole('button', { name: 'Eraser' }));
  fireEvent.click(screen.getByRole('gridcell', { name: 'Row 1, column 1: Rust' }));
  expect(screen.getByRole('gridcell', { name: 'Row 1, column 1: Paper' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Close drawing surface' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(trigger).toHaveFocus();
  expect(document.body.style.overflow).toBe('');
  openDrawing();
  expect(screen.getByRole('gridcell', { name: 'Row 1, column 2: Blue' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Start over' }));
  expect(screen.getByRole('button', { name: 'Start over' })).toBeDisabled();
  fireEvent(screen.getByRole('dialog'), new Event('cancel', { bubbles: true, cancelable: true }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(trigger).toHaveFocus();
});

test('keyboard navigation has one grid tab stop and Delete erases', () => {
  home();
  openDrawing();
  const cells = screen.getAllByRole('gridcell');
  expect(cells.filter((cell) => cell.tabIndex === 0)).toHaveLength(1);
  fireEvent.keyDown(cells[0], { key: 'ArrowRight' });
  expect(cells[1]).toHaveFocus();
  fireEvent.click(cells[1], { detail: 0 });
  expect(cells[1]).toHaveAccessibleName('Row 1, column 2: Rust');
  fireEvent.keyDown(cells[1], { key: 'Delete' });
  expect(cells[1]).toHaveAccessibleName('Row 1, column 2: Paper');
});

function pointer(target, name, values) {
  const event = new Event(name, { bubbles: true, cancelable: true });
  Object.assign(event, values);
  fireEvent(target, event);
  return event;
}

test('Tab and Shift+Tab keep keyboard focus inside the drawing dialog', async () => {
  const user = userEvent.setup();
  home();
  await user.click(screen.getByRole('button', { name: 'Draw on the computer' }));
  const close = screen.getByRole('button', { name: 'Close drawing surface' });
  expect(close).toHaveFocus();
  await user.tab({ shift: true });
  expect(screen.getByRole('gridcell', { name: 'Row 1, column 1: Paper' })).toHaveFocus();
  await user.tab();
  expect(close).toHaveFocus();
});

test('finger movements are not canceled or painted, while completed taps paint', () => {
  home();
  openDrawing();
  const grid = screen.getByRole('grid');
  const cell = screen.getAllByRole('gridcell')[0];
  const start = pointer(grid, 'pointerdown', { pointerType: 'touch', pointerId: 1, button: 0 });
  pointer(grid, 'pointermove', { pointerType: 'touch', pointerId: 1, clientX: 80, clientY: 100 });
  pointer(grid, 'pointercancel', { pointerType: 'touch', pointerId: 1 });
  expect(start.defaultPrevented).toBe(false);
  expect(cell).toHaveAccessibleName('Row 1, column 1: Paper');
  fireEvent.click(cell, { detail: 1 });
  expect(cell).toHaveAccessibleName('Row 1, column 1: Rust');
});

test('mouse dragging fills the cells between pointer events', () => {
  home();
  openDrawing();
  const grid = screen.getByRole('grid');
  vi.spyOn(grid, 'getBoundingClientRect').mockReturnValue({
    left: 0,
    top: 0,
    width: 120,
    height: 80,
  });
  pointer(grid, 'pointerdown', {
    pointerType: 'mouse',
    pointerId: 2,
    button: 0,
    clientX: 5,
    clientY: 5,
  });
  pointer(grid, 'pointermove', { pointerType: 'mouse', pointerId: 2, clientX: 35, clientY: 5 });
  pointer(grid, 'pointerup', { pointerType: 'mouse', pointerId: 2 });
  for (let column = 1; column <= 4; column++)
    expect(
      screen.getByRole('gridcell', { name: `Row 1, column ${column}: Rust` }),
    ).toBeInTheDocument();
});

test('duck waits for its assets, greets once, and recovers from an image failure', () => {
  vi.useFakeTimers();
  const { container } = home();
  const duck = screen.getByRole('button', { name: 'Say hello to the little duck' });
  expect(duck).toBeDisabled();
  container
    .querySelectorAll('.office-room-details image')
    .forEach((image) => fireEvent.load(image));
  fireEvent.click(duck);
  expect(duck).toHaveAttribute('aria-busy', 'true');
  expect(screen.getByRole('status')).toHaveTextContent('Hello from the duck.');
  act(() => vi.advanceTimersByTime(1200));
  expect(duck).toHaveAttribute('aria-busy', 'false');
  fireEvent.error(container.querySelector('.office-duck-cutout'));
  expect(
    screen.queryByRole('button', { name: 'Say hello to the little duck' }),
  ).not.toBeInTheDocument();
});

test('reduced motion closes immediately; unmount restores page scrolling', () => {
  window.matchMedia = vi.fn(() => ({ matches: true }));
  const { unmount } = home();
  openDrawing();
  fireEvent.click(screen.getByRole('button', { name: 'Close drawing surface' }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  openDrawing();
  unmount();
  expect(document.body.style.overflow).toBe('');
});
