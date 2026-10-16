// Google Apps Script for the "Early access" sheet.
// Receives signups from the site's /api/early-access function and appends a row.
// Setup steps: see README.md in this folder.

const SECRET = 'PASTE_THE_SAME_SECRET_AS_VERCEL_HERE';
const SHEET_NAME = 'Signups';
const HEADERS = ['Submitted at', 'Name', 'Work email', 'Firm / studio', 'Role', 'Message', 'Source'];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.secret !== SECRET) return reply({ ok: false, error: 'unauthorized' });

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(HEADERS);
        sheet.setFrozenRows(1);
        sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      }
      sheet.appendRow([
        data.submittedAt ? new Date(data.submittedAt) : new Date(),
        data.name || '',
        data.email || '',
        data.company || '',
        data.role || '',
        data.message || '',
        data.source || '',
      ]);
    } finally {
      lock.releaseLock();
    }
    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  }
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
