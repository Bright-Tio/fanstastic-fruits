# Netlify Identity Password Protection (Real Auth)

This project replaces "front-end only" hiding with **Netlify Identity + a protected Netlify Function**.
The sensitive page content is no longer embedded in the HTML files — it is returned only when a user is authenticated.

## How it works
- The HTML pages are *shells* (layout only).
- After login, the browser requests `/.netlify/functions/get-page?page=<name>` with `Authorization: Bearer <JWT>`.
- Netlify verifies the JWT and exposes the decoded user on `context.clientContext.user`.
- If the user is not authenticated, the function returns `401` and the page stays locked.

## Deploy / Configure on Netlify
1. Push this folder to GitHub (or drag-and-drop the folder into Netlify Deploys).
2. In Netlify:
   - Site settings → Identity → Enable Identity
   - Identity → Registration → set to **Invite only** if you want true “password protection” (no public signups)
   - Identity → Users → Invite your users
3. Visit your site, click **Log in**, and authenticate.

## Notes
- Because authentication requires a login UI and token handling, some JavaScript is still necessary.
  The difference is: **content is protected server-side** (via the Function), not “hidden” client-side.
