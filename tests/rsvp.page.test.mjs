import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const pagePath = path.join(process.cwd(), 'src', 'pages', 'index.astro');
const expectedEndpoint = 'https://script.google.com/macros/s/AKfycbwwnE3knecEN0fJwlWXddEgkPjvDxAKZbSFgHkXlDMYvhRu_Pb1v_aKJNe3IlHkROKo/exec';

test('index.astro contains the Google Apps Script endpoint and submission call', async () => {
  const pageContent = await fs.promises.readFile(pagePath, 'utf-8');

  assert.match(
    pageContent,
    new RegExp(`const googleScriptUrl = import\.meta\.env\.PUBLIC_RSVP_SCRIPT_URL \|\| '${expectedEndpoint}'`),
    'Expected googleScriptUrl default to use the provided Google Apps Script endpoint.'
  );

  assert.match(
    pageContent,
    /backupToGoogleSheet\(payload, googleScriptUrl, \{ token: 'wedding-rsvp' \}\);/,
    'Expected the RSVP submission flow to call backupToGoogleSheet with the correct token.'
  );
});
