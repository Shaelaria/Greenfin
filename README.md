# Greenfin website

The static website for Greenfin, the living soil amendment from Green Fin Amendments LLC in New Haven, Missouri.

Plain HTML, one stylesheet (`assets/css/styles.css`) and one small script (`assets/js/main.js`). There's no framework and no build step.

## Deploy

Upload the contents of this repository to the web root of any static host:

- **Netlify or Cloudflare Pages:** connect this repository, leave the build command empty and set the publish directory to `/`. Both hosts serve `404.html` automatically.
- **GoDaddy or other Apache hosting:** upload everything to `public_html`, and add `ErrorDocument 404 /404.html` to `.htaccess`.

Then point `www.greenfinamendments.com` at the host.

## Forms

The contact, wholesale and newsletter forms use [Netlify Forms](https://docs.netlify.com/forms/setup/). On Netlify they work as soon as the site is deployed: submissions appear in the Netlify dashboard under **Forms**, and you can turn on email notifications there. After sending, visitors land on `thanks.html`.

On a host other than Netlify, change each form's `action` to a form service such as Formspree, and remove the `data-netlify` and `netlify-honeypot` attributes.

## Ordering

Ordering currently works by email. Each size on `products.html` opens an email to sales@greenfinamendments.com with the size filled in. To switch to online checkout, replace the `data-checkout` link on each size with a Shopify, Square or Stripe payment link. Adding a `data-price` attribute to each size shows the price on the page.

## Still to add

The site works without these, but they'll make it better:

- Prices per size, and online checkout links (see Ordering).
- Instagram, Facebook and YouTube links for the footer.
- Lab report figures for the test results section of `how-to-use.html`.
- Names of the partner organizations on `our-story.html`.
- Real photos. The illustrated stand-ins each have an HTML comment describing the photo to use.

## Editing

The header and footer are repeated in every page, so a change to either one has to be made in all of the HTML files. Colors are set as tokens at the top of `styles.css`. The light theme comes first, then the dark-theme values.
