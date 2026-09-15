# Very Good Apps LLC

The company website at **verygoodapps.co**. React handles the pages and the interactive office; Vite builds static files for GitHub Pages. No application server, database, analytics, or client-side router.

## Run locally

Use Node 24 LTS and npm. With nvm installed:

```sh
nvm install
nvm use
npm ci
npm run dev
```

Open http://localhost:4187. The dev server is also available to devices on the same network at your computer’s LAN address, port 4187. Run only one dev/preview server on that port.

```sh
npm run check       # lint, interaction tests, production build checks
npm run build       # produces dist/
npm run preview     # serves the production build locally
npm run format     # formats source and documentation
```

## Where to edit

| Change                                                           | File                                           |
| ---------------------------------------------------------------- | ---------------------------------------------- |
| Homepage wording and sections                                    | `src/pages/Home.jsx`                           |
| Privacy wording                                                  | `src/pages/Privacy.jsx`                        |
| Company name, email, member names                                | `src/site.js`                                  |
| Header, logo, footer                                             | `src/components/Header.jsx`, `Footer.jsx`      |
| Colors, fonts, page layout                                       | `src/styles/site.css`                          |
| Office positioning, labels, animation, drawing styles            | `src/styles/office.css`                        |
| Office behavior                                                  | `src/components/office/`                       |
| Images, icons, self-hosted fonts and licenses                    | `public/`                                      |
| Page titles, descriptions, favicon links, no-JavaScript fallback | `index.html`, `privacy/index.html`, `404.html` |

There are two real pages: `/` and `/privacy/`. Each has a small HTML entry file and shares the React entry point. Links use normal browser navigation. `404.html` is GitHub Pages’ not-found page. `/privacy-policy/` redirects to the company privacy page; old hash bookmarks are handled by `src/legacyLinks.js`.

`KeepTogether` keeps short phrases together when they fit, while still allowing a narrow container or enlarged text to wrap. Avoid adding viewport-specific line breaks to copy.

## The interactive office

`InteractiveOffice.jsx` owns the day/evening state and opens the drawing dialog. Both lamps change the same scene. The evening control becomes available when its image loads; a failed image leaves the daytime office visible.

`Duck.jsx` places a small cutout over a clipped clean patch of the original image. The asset and hotspot coordinates share the original 1536 × 1024 illustration. Preserve that coordinate system when editing the artwork. The duck waits for its assets and fails back to the original illustration if loading fails.

`DrawingDialog.jsx` manages the native dialog, focus return, page scroll lock, and opening/closing animation. `DrawingGrid.jsx` contains the drawing state and input handling. Mouse/pen dragging paints, touch taps paint, finger swipes remain scrolling, and keyboard users can move with arrows, draw with Space/Enter, and erase with Delete. Closing/reopening retains the drawing; reloading or leaving the page clears it. Nothing is stored or sent anywhere.

Motion respects the visitor’s reduced-motion preference. All interactions are silent.

## Publishing to GitHub Pages

Production publication is **manual**. Pushing `main` runs checks only.

One-time setup, when ready to release:

1. Push the reviewed source and workflows to GitHub.
2. In repository **Settings → Pages**, switch **Source** to **GitHub Actions**. Keep the custom domain `verygoodapps.co` and HTTPS configuration. DNS does not change.
3. In **Actions → Deploy website → Run workflow**, select `main`.

The workflow installs the locked dependencies, runs `npm run check`, uploads `dist/`, and deploys that artifact to Pages. It will not deploy other branches. The `gh-pages` branch is no longer needed by this workflow; leave the old branch in place until the first release is verified.

Before the one-time switch, the live site continues to publish the existing `gh-pages` branch. Neither local builds nor these local workflow files change the live site. There is deliberately no local `npm run deploy` command that pushes generated files.

For rollback after a release, revert the source change on `main`, push the revert, and run **Deploy website** again. Preserve `public/CNAME`.

## Design backup

The complete eleven-direction gallery and its local history are preserved on the local-only branch `backup/design-gallery-2026-09-15`, snapshot `d9950cda`. The production rebuild starts from remote source commit `ea008b02`. Neither branch has been pushed as part of this rebuild.

To revisit the gallery without replacing this working tree, create a separate checkout with `git worktree add ../verygoodapps-gallery backup/design-gallery-2026-09-15`, then install its own dependencies. A local branch is recoverable history on this disk, not an off-device backup.
