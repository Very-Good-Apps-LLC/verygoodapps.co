# Very Good Apps LLC

Source for [verygoodapps.co](https://verygoodapps.co), the Very Good Apps LLC company website. Built with React, Vite, JavaScript, and CSS; hosted on GitHub Pages.

## Development

Requires Node 24 LTS and npm. With [nvm](https://github.com/nvm-sh/nvm):

```sh
nvm install
nvm use
npm ci
npm run dev
```

Open http://localhost:4187. For testing on another device on the same network, use the computer’s LAN address with port `4187`.

| Command              | Purpose                                         |
| -------------------- | ----------------------------------------------- |
| `npm run dev`        | Start the development server with live updates  |
| `npm test`           | Run page and interaction tests                  |
| `npm run test:watch` | Rerun tests while editing                       |
| `npm run check`      | Run lint, tests, build, and build-output checks |
| `npm run build`      | Build the site into `dist/`                     |
| `npm run preview`    | Serve the latest build locally on port 4187     |
| `npm run format`     | Format source and documentation                 |

Run `npm run build` before using the preview server. Stop the development server first; both use the same port. Generated dependencies and build output are ignored by Git.

## Project structure

| Path                 | Contents                                             |
| -------------------- | ---------------------------------------------------- |
| `src/pages/`         | Homepage, privacy, and not-found page components     |
| `src/components/`    | Header, footer, text helpers, and interactive office |
| `src/styles/`        | Page and office styles                               |
| `src/site.js`        | Shared company name, contact email, and member names |
| `public/`            | Images, icons, fonts, licenses, and hosting files    |
| `tests/`             | Page and interaction tests                           |
| `.github/workflows/` | CI checks and manual deployment                      |

`index.html`, `privacy/index.html`, and `404.html` are HTML entry files with page-specific metadata. Each loads `src/main.jsx`; React renders the appropriate page through `src/App.jsx`. Page links use standard browser navigation. Vite produces static files that GitHub Pages serves directly.

Edit visible copy in `src/pages/`. Company details also appear in the HTML metadata, no-JavaScript fallbacks, and `public/manifest.webmanifest`; update those when changing shared details.

The office components are in `src/components/office/`. `InteractiveOffice.jsx` controls lighting and opens the drawing dialog, `Duck.jsx` animates the duck, and `DrawingGrid.jsx` handles drawing input. Artwork coordinates use a 1536 × 1024 canvas. Drawings stay in browser memory.

## Verification

Run `npm run check` before submitting changes. It includes `scripts/check-build.mjs`, which verifies generated HTML entries, their local file references, manifest icons, indexing directives, and GitHub Pages files. Check layout and interactions in a browser after visual changes.

Preview the custom error page at `/404.html`. GitHub Pages automatically serves it for missing URLs; the local Vite server does not provide that fallback.

## Deployment

1. Push reviewed changes to `main`.
2. Confirm the **Check website** workflow passes.
3. Open **Actions → Deploy website → Run workflow** and select `main`.
4. Verify the live homepage, privacy page, office interactions, and a missing URL.

Deployment is manual. The deploy workflow runs checks, builds the site, and publishes `dist/`. Pull requests and pushes to `main` run checks without publishing.

To roll back a release, revert the relevant source changes on `main` and run the deployment workflow again.
