/**
 * Damon BlaQ — webinar leads → Google Sheet
 *
 * Setup (once, ~3 minutes):
 * 1. Open the "Damon BlaQ Webinar Leads" Google Sheet.
 * 2. Extensions → Apps Script. Delete what's there, paste this file, Save.
 * 3. Deploy → New deployment → type "Web app".
 *      Execute as: Me
 *      Who has access: Anyone
 *    Deploy, approve the permissions, copy the URL ending in /exec.
 * 4. Paste that URL into SHEET_ENDPOINT in index.html and push.
 *
 * After editing this script later: Deploy → Manage deployments → Edit →
 * Version: New version. (The /exec URL stays the same.)
 */

// The "Damon BlaQ Webinar Leads" sheet. Works whether this script is attached to the sheet or standalone.
const SHEET_ID = '1JOQJ-0Vt8qy8QbqF705RBO7CnjMJlLe2bwVubBITZGM';

const HEADERS = [
  'Submitted at', 'Name', 'WhatsApp', 'Email', 'Based in', 'Interested in',
  'Budget', 'Purchase route', 'Timeline', 'Next step', 'Preferred contact',
  'Consent', 'Consent wording', 'Referred by', 'Source', 'Page', 'Submission ID'
];

// Optional: an address that gets an email for every new lead, e.g. 'info@damonblaq.com'.
const NOTIFY_EMAIL = '';

function doPost(e) {
  try {
    const d = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    if (d.website) return json({ ok: true });                       // spam trap filled in
    if (!d.name || !d.phone || !d.email || d.consent !== true) {
      return json({ ok: false, error: 'Missing required fields' });
    }

    const id = String(d.id || '').slice(0, 64);
    const cache = CacheService.getScriptCache();
    if (id && cache.get(id)) return json({ ok: true, duplicate: true });

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sh = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
      const head = sh.getRange(1, 1, 1, HEADERS.length).getValues()[0];
      if (head.join('|') !== HEADERS.join('|')) {
        sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
        sh.setFrozenRows(1);
      }
      sh.appendRow([
        new Date(), d.name, d.phone, d.email, d.based, d.interests, d.budget,
        d.route, d.timeline, d.next, d.contact, 'Yes', d.consentText,
        d.ref, d.source, d.page, id
      ].map(clean));
    } finally {
      lock.releaseLock();
    }
    if (id) cache.put(id, '1', 21600);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(NOTIFY_EMAIL, 'New lead: ' + d.name + ' (' + (d.source || 'webinar') + ')', [
        'Name: ' + d.name, 'WhatsApp: ' + d.phone, 'Email: ' + d.email, 'Based in: ' + d.based,
        'Interested in: ' + d.interests, 'Budget: ' + d.budget, 'Purchase route: ' + d.route,
        'Timeline: ' + d.timeline, 'Next step: ' + d.next, 'Preferred contact: ' + d.contact,
        'Referred by: ' + (d.ref || '—')
      ].join('\n'));
    }
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json({ ok: true, service: 'Damon BlaQ webinar leads' });
}

// Stops values like "+44…" or "=SUM(…)" being read as formulas.
function clean(v) {
  if (v instanceof Date) return v;
  v = String(v == null ? '' : v).slice(0, 1000);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
