# Damon BlaQ — UK Buy-to-Let Interest Form

One-question-per-screen enquiry form for Damon BlaQ Consulting's UK buy-to-let units.

- Single static file: `index.html` (no build step). Deploy to Vercel, Netlify or any static host.
- Animations: GSAP 3.12.5 (cdnjs). Respects "reduce motion".
- Fonts: Urbanist (headings) and Figtree (body) from Google Fonts, standing in for Samsung Sharp Sans and Uber Move. Swap the `--display` / `--font` tokens if the licensed fonts are added.
- Light and dark mode follow the device setting.

## How submissions work

The page stores nothing on a server. On the review screen the visitor sends their answers by:

- **WhatsApp** to +234 904 860 6453 (pre-filled message via wa.me)
- **Email** to info@damonblaq.com (pre-filled mailto)
- **Copy** to clipboard

A draft is kept in the visitor's own browser (localStorage) so they can pick up where they left off.

## Next step

Post submissions to the CRM (e.g. `POST /api/webinar`) so every enquiry lands as a lead with source and consent recorded. WhatsApp then becomes optional.
