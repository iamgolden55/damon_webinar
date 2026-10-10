# Damon BlaQ — UK Buy-to-Let Interest Form

One-question-per-screen enquiry form for Damon BlaQ Consulting. Every submission is saved as a row in a Google Sheet.

- `index.html` — the whole page. No build step; deploy to Vercel, Netlify or any static host.
- `apps-script/Code.gs` — the Google Apps Script that writes submissions into the sheet.

## Set up lead capture (once, ~3 minutes)

1. Open the **Damon BlaQ Webinar Leads** Google Sheet.
2. **Extensions → Apps Script**. Replace the code with `apps-script/Code.gs`. Save.
3. **Deploy → New deployment → Web app**. Execute as **Me**, access **Anyone**. Approve permissions and copy the URL ending in `/exec`.
4. Paste it into `SHEET_ENDPOINT` near the top of the script in `index.html`, commit and push.
5. Test: submit the form once and check a row appears.

If `SHEET_ENDPOINT` is empty or the sheet can't be reached, the visitor is offered WhatsApp, email or copy instead, so no enquiry is lost.

## Tracking who brought each lead

Add `?ref=<name>` to the link each salesperson shares, e.g. `…/?ref=mardiyya`. It appears in the **Referred by** column. `utm_source`, `utm_campaign` and `source` are also recorded (`source` defaults to "Webinar 10 Oct 2026").

## Details

- Spam: hidden trap field, plus duplicate submissions are ignored by ID.
- Consent: the exact wording the visitor agreed to is stored with each row.
- Optional email alert per lead: set `NOTIFY_EMAIL` in `Code.gs`.
- Animations: GSAP 3.12.5. Fonts: Urbanist and Figtree (stand-ins for Samsung Sharp Sans and Uber Move).
