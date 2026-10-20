# Greenfin website

The static website for Greenfin, the living soil amendment from Green Fin Amendments LLC in New Haven, Missouri.

Plain HTML, one stylesheet (`assets/css/styles.css`) and one small script (`assets/js/main.js`). There's no framework and no build step.

## Deploy

Upload the contents of this repository to the web root of any static host:

- **Netlify or Cloudflare Pages:** connect this repository, leave the build command empty and set the publish directory to `/`. Both hosts serve `404.html` automatically.
- **GoDaddy or other Apache hosting:** upload everything to `public_html`, and add `ErrorDocument 404 /404.html` to `.htaccess`.

Then point `www.greenfinamendments.com` at the host.

## Before going live

Search the files for `[[` to find every placeholder that still needs real content:

- `[[PRICE]]` and `[[CHECKOUT URL]]`, set once per size on `products.html`.
- `[[FORM ENDPOINT]]` on the contact and wholesale forms.
- `[[EMAIL LIST ENDPOINT]]` on the newsletter signup, both on the home page and in the footer.
- `[[PHONE]]`
- The social links, which point to `#`.
- `[[TEST NAME]]`, `[[TEST RESULT]]` and `[[WHAT IT MEANS]]` on `how-to-use.html`.
- `[[POLICY DATE]]` and `[[PARTNER NAMES]]`.
- Photography placeholders. Each one has an HTML comment describing the photo to use.

## Editing

The header and footer are repeated in every page, so a change to either one has to be made in all of the HTML files. Colors are set as tokens at the top of `styles.css`. The light theme comes first, then the dark-theme values.
