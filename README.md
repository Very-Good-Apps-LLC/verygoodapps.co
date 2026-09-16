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

## Analytics

[Google Analytics 4](https://analytics.google.com/analytics/web/#/a312455974p554515218/reports/intelligenthome) is configured in `src/analytics.js` with public measurement ID `G-1WYH706CWZ`. It loads only on the production domain after a visitor accepts. The footer’s Analytics settings control lets visitors change their choice. Local and preview traffic is excluded.

The property uses basic traffic measurement with enhanced measurement disabled. Advertising consent and personalization are disabled in the tag. Keep the privacy notice in `src/pages/Privacy.jsx` aligned with any collection changes.

## Deployment

Publishing requires a push from your computer and a manual deployment in GitHub. Pushing alone does not update the live website.

1. In your terminal, open your local checkout of this repository. Switch to `main` and run the checks:

   ```sh
   git switch main
   npm run check
   git status
   ```

2. In the same terminal, commit the changes you intend to publish and push them. If they are already committed, run only the push command:

   ```sh
   git add -A
   git commit -m "Describe your changes"
   git push origin main
   ```

   Review the `git status` output before staging: `git add -A` includes all changed and untracked files that are not ignored.

3. In your browser, open the repository’s [Check website workflow](https://github.com/Very-Good-Apps-LLC/verygoodapps.co/actions/workflows/check.yml). Open the run for the commit you just pushed to `main`. Wait for it to finish with a green check. If it fails, open the failed job to read the error and fix it before continuing.

4. In GitHub, open the [Deploy website workflow](https://github.com/Very-Good-Apps-LLC/verygoodapps.co/actions/workflows/deploy.yml). Above the list of runs, click **Run workflow**, select **main** in the branch dropdown, then click the green **Run workflow** button. This starts the production deployment.

5. On that workflow page, open the new run. Wait for both the **build** and **deploy** jobs to finish successfully. The workflow builds and publishes the site; you do not upload `dist/` yourself.

6. In your browser, check the published site:
   - [Homepage](https://verygoodapps.co/): test the lamps, duck, and drawing interaction.
   - [Privacy page](https://verygoodapps.co/privacy/).
   - [Missing page](https://verygoodapps.co/page-that-does-not-exist): confirm the custom 404 appears.

To roll back a change, run `git revert <commit>` in your local checkout, replacing `<commit>` with its commit ID. Then repeat the checks, push, and manual deployment above.
