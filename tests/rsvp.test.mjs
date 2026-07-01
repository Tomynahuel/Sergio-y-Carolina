import test from 'node:test';
import assert from 'node:assert/strict';
import { backupToGoogleSheet, buildGuestCsv, buildMailtoLink } from '../src/lib/rsvp.mjs';

test('buildGuestCsv includes headers and rows', () => {
  const csv = buildGuestCsv([
    { name: 'Ana', email: 'ana@example.com', guests: 2, attendance: 'acepta', message: 'Hola' }
  ]);

  assert.match(csv, /nombre,email,invitados,asistencia,mensaje/);
  assert.match(csv, /Ana/);
  assert.match(csv, /ana@example.com/);
});

test('buildMailtoLink encodes recipient and body', () => {
  const link = buildMailtoLink({
    to: 'test@example.com',
    subject: 'Confirmación',
    body: 'Hola'
  });

  assert.equal(link.startsWith('mailto:'), true);
  assert.match(link, /test@example.com/);
  assert.match(link, /Confirmaci%C3%B3n/);
});

test('backupToGoogleSheet posts the RSVP payload with form data', async () => {
  let latestOptions;
  global.fetch = async (url, options) => {
    latestOptions = options;
    return new Response(null, { status: 200 });
  };

  await backupToGoogleSheet({ name: 'Ana', attendance: 'acepta' }, 'https://example.com/script');

  assert.equal(latestOptions.method, 'POST');
  assert.equal(latestOptions.mode, 'no-cors');
  assert.equal(typeof latestOptions.body.append, 'function');
  assert.equal(latestOptions.body.get('name'), 'Ana');
  assert.equal(latestOptions.body.get('attendance'), 'acepta');
});
