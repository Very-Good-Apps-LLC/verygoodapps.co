# Very Good Apps LLC

The company website at **verygoodapps.co**, built with React, Vite, JavaScript, and plain CSS. GitHub Pages serves the built files. There is no application server, database, analytics, or password gate.

## Run locally

Use Node 24 LTS and npm. With nvm installed:

```sh
nvm install
nvm use
npm ci
npm run dev
```

Open http://localhost:4187. The dev server also accepts connections from devices on the same network at your computer’s LAN address, port 4187. Run only one dev or preview server on that port.

```sh
npm test            # page and interaction tests
npm run check       # lint, tests, production build, and build-output checks
npm run build       # generates dist/
npm run preview     # serves dist/ locally; build first
npm run format      # formats source and documentation
```

The dev server updates as you edit source. The preview server serves the last build, so run `npm run build` again after source changes. `node_modules/` and `dist/` are generated locally and ignored by Git.

## How the pages work

This is a React site with separate HTML entry files, not a Next.js app. There is no framework router or server rendering.

```text
index.html                  Entry for /
privacy/index.html          Entry for /privacy/
404.html                    Entry for missing pages on GitHub Pages
src/main.jsx                Starts React and handles old hash bookmarks
src/App.jsx                 Selects a React page from the URL pathname
src/pages/                  Homepage, privacy, and not-found content
src/components/             Shared UI and office interactions
```

Each HTML entry contains its own title and metadata, a root element, and the same React startup script. React renders the content in the browser. The HTML files include a brief company/contact fallback for visitors with JavaScript disabled; the full pages require JavaScript.

Links between the homepage and privacy page use ordinary browser navigation and load a new document. The top-level `privacy/` folder gives GitHub Pages a real file to serve at `/privacy/`; the privacy copy lives in `src/pages/Privacy.jsx`.

`public/` contains assets that Vite copies into `dist/`. Its `/privacy-policy/` page redirects to `/privacy/`. Old hash URLs, including `/#/privacy-policy`, are handled by `src/legacyLinks.js`.

### Local 404 behavior

GitHub Pages serves `404.html` for missing URLs. Vite’s local servers do not reproduce that fallback with this configuration: visiting a missing path can show the browser’s own 404 error. Open http://localhost:4187/404.html to view the custom page locally. This checks its appearance, not the hosting fallback.

## Where to edit

| Change                                                           | File                                                     |
| ---------------------------------------------------------------- | -------------------------------------------------------- |
| Homepage wording and sections                                    | `src/pages/Home.jsx`                                     |
| Privacy wording                                                  | `src/pages/Privacy.jsx`                                  |
| Not-found wording                                                | `src/pages/NotFound.jsx`                                 |
| Shared company name, contact email, and member names             | `src/site.js`                                            |
| Header, logo, footer                                             | `src/components/Header.jsx`, `src/components/Footer.jsx` |
| Colors, fonts, page layout                                       | `src/styles/site.css`                                    |
| Office positioning, labels, animation, drawing styles            | `src/styles/office.css`                                  |
| Office behavior                                                  | `src/components/office/`                                 |
| Images, icons, self-hosted fonts and licenses                    | `public/`                                                |
| Page titles, descriptions, favicon links, no-JavaScript fallback | `index.html`, `privacy/index.html`, `404.html`           |

`src/site.js` supplies shared values used by components. It does not control every mention: page copy, HTML metadata and fallbacks, and the web manifest also contain company details. When changing company details, search the repository for the old value to update all occurrences.

`KeepTogether` groups short phrases while allowing them to wrap when their container is too narrow. Avoid viewport-specific line breaks in copy.

## Checks

`npm run check` runs ESLint, the page and interaction tests, a production build, and `scripts/check-build.mjs`. The GitHub workflows run this same command.

`check-build.mjs` inspects `dist/`. It checks that the expected HTML pages exist, local files referenced by those HTML entries and manifest icons exist, the homepage and privacy entries are not marked `noindex`, and the GitHub Pages domain and `.nojekyll` files are present. It runs during development and deployment checks, not in visitors’ browsers. It does not test the hosting server’s routing or every asset referenced inside React or CSS.

## The interactive office

`InteractiveOffice.jsx` owns the day/evening state and opens the drawing dialog. Both lamps change the same scene. The evening control becomes available when its image loads; a failed evening image leaves the daytime office visible.

`Duck.jsx` places a small cutout over a clipped clean patch of the original image. The asset and hotspot coordinates share the original 1536 × 1024 illustration. Preserve that coordinate system when editing the artwork. The duck waits for its assets and falls back to the original illustration if loading fails. See [artwork notes](docs/artwork.md) for image and font provenance.

`DrawingDialog.jsx` manages the native dialog, focus return, page scroll lock, and opening/closing animation. `DrawingGrid.jsx` contains drawing state and input handling. Mouse/pen dragging paints, touch taps paint, finger swipes remain native scrolling, and keyboard users can move with arrows, draw with Space/Enter, and erase with Delete. Closing and reopening the dialog retains the drawing. Drawing state stays in browser memory and is not saved to storage or sent to a server.

Motion respects the visitor’s reduced-motion preference. All interactions are silent.

## Publishing to GitHub Pages

### One-time migration from the old site

The old site uses the `gh-pages` branch. When ready for the first release of this version:

1. Push the reviewed source and workflows to `main` on GitHub.
2. In repository **Settings → Pages**, switch **Source** to **GitHub Actions**. Keep the custom domain `verygoodapps.co` and HTTPS configuration. No DNS change is needed for this switch.
3. Run **Actions → Deploy website → Run workflow**, selecting `main`.
4. After deployment succeeds, verify the homepage, privacy page, office interactions, and a nonexistent URL at the live domain.

Leave the old `gh-pages` branch in place until that release is verified. The new workflow does not use it. This migration section can be removed after the switch is complete.

### Regular releases

Publishing is manual. The check workflow runs on pull requests and pushes to `main`; it does not deploy.

1. Run `npm run check` locally and review the changes.
2. Push the reviewed changes to `main` and confirm **Check website** passes.
3. Run **Actions → Deploy website → Run workflow**, selecting `main`.

The deployment workflow installs the locked dependencies, repeats `npm run check`, uploads `dist/`, and publishes it to Pages. It only deploys `main`. Local builds do not change the live site, and there is no local `npm run deploy` command.

For a rollback after a later release, revert the offending source change on `main`, push the revert, and run **Deploy website** again. Keep the deployment workflow and `public/CNAME` intact.
