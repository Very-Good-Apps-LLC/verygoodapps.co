# Production rebuild verification

Checked locally on September 15, 2026.

## Preserved history

- The complete gallery is on local branch `backup/design-gallery-2026-09-15`, commit `d9950cdaaf2876398bba37aa6a4325703a4fddd8`.
- The production rebuild starts from remote `main`, commit `ea008b02e9ee77058674f6c70c4b037c28402125`.
- No push, deployment, DNS change, or Pages setting change was performed.

## Automated checks

- Clean dependency installation using Node 24 LTS.
- ESLint and the production build pass.
- 17 page and interaction tests pass, including drawing input, dialog focus, image failure behavior, and old bookmarks.
- 13 tests pass for the separate Netlify review gate.
- Build checks verify page entries, linked assets, icons, the custom domain, and separation from the password-protected preview.
- Dependency audit reports no known vulnerabilities at the time of the check.

## Browser checks

- Compared the approved concept with the production page at desktop, tablet, and phone widths: 1440, 768, 375, and 320 pixels.
- Confirmed the homepage copy matches the approved concept.
- Checked both lamps, the duck, drawing colors, erasing, keyboard drawing, closing and reopening the dialog, and returning focus to the computer.
- Confirmed keyboard focus stays inside the drawing dialog and Escape closes it.
- Checked the privacy page, direct navigation, refresh, and old privacy bookmarks.
- Confirmed no horizontal overflow at 320 pixels and that the drawing dialog fits a 375 × 667 viewport.
- Corrected two existing layout issues during the port: the headline at the narrowest width and the drawing toolbar’s Start over button.

## Release checks still needed

The browser checks used desktop browser viewport emulation, not a physical iPhone. Touch input handling is covered in tests, but a final Safari check on a real phone remains useful.

The GitHub Actions workflow has not run remotely. Its first release requires the one-time Pages source change and manual workflow run described in the README. Production has no password gate; the separate Netlify preview retains its gate.
