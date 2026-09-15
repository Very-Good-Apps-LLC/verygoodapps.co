# Private Netlify review

Production uses GitHub Pages. This folder supports the existing private review site, `dynamic-dodol-61064a.netlify.app`.

From the repository root:

```sh
npm run prepare:review
```

This builds the site, replaces `netlify-preview/site/` with a fresh copy, removes `CNAME`, and adds preview-only indexing restrictions to every HTML page. It does not deploy anything.

When explicitly ready to publish a review:

```sh
npx netlify-cli@latest deploy --prod --no-build --site 4b0af712-ebb7-47e0-978c-772b9e1b8424
```

Run this from the repository root so `netlify.toml` bundles the `review-gate` Edge Function. Do not upload the folder through Netlify Drop; that omits the password gate.

The password is the Netlify environment variable `PREVIEW_PASSWORD`. It is read only by the Edge Function. Missing configuration denies access. Setting it to a different value also invalidates existing sessions. The gate is applied to every path, including assets and privacy pages. Do not enable Netlify Split Testing, which can bypass Edge Functions.

After any deployment, verify signed-out access to both pages and an asset requires a password, sign-in works, and responses retain `X-Robots-Tag: noindex`. The regular `dist/` production output does not contain the password gate or preview indexing restrictions.

Local Netlify state, generated output, and environment files are ignored by Git. The existing site link and server-side password are not changed by the production rebuild.
