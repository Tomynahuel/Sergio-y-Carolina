import test from 'node:test';
import assert from 'node:assert/strict';
import { backupToGoogleSheet, buildGuestCsv, buildMailtoLink } from '../src/lib/rsvp.mjs';

test('RSVP form submission flow simulates complete end-to-end process', async () => {
  // Simular datos del formulario
  const formData = {
    name: 'Juan García',
    email: 'juan@example.com',
    guests: '2',
    attendance: 'acepta',
    message: 'Nos encanta celebrar con ustedes',
  };

  // Paso 1: Leer lista de invitados existente (simulada)
  const existingGuests = [];
  const nextGuests = [...existingGuests, formData];

  // Paso 2: Generar CSV
  const csvContent = buildGuestCsv(nextGuests);
  assert.match(csvContent, /Juan García/);
  assert.match(csvContent, /juan@example.com/);
  assert.match(csvContent, /acepta/);
  assert.match(csvContent, /Nos encanta celebrar con ustedes/);

  // Paso 3: Preparar payload para Google Sheets
  const payload = {
    name: formData.name,
    email: formData.email,
    guests: formData.guests,
    attendance: formData.attendance,
    message: formData.message,
  };

  // Paso 4: Simular envío a Google Sheets
  let googleSheetsCalled = false;
  let googleSheetsPayload = null;

  global.fetch = async (url, options) => {
    googleSheetsCalled = true;
    googleSheetsPayload = {
      url,
      method: options.method,
      mode: options.mode,
      body: {
        name: options.body.get('name'),
        email: options.body.get('email'),
        guests: options.body.get('guests'),
        attendance: options.body.get('attendance'),
        message: options.body.get('message'),
        sys_ref_id: options.body.get('sys_ref_id'),
      },
    };
    return new Response(null, { status: 200 });
  };

  const googleScriptUrl = 'https://script.google.com/macros/s/AKfycbwwnE3knecEN0fJwlWXddEgkPjvDxAKZbSFgHkXlDMYvhRu_Pb1v_aKJNe3IlHkROKo/exec';
  await backupToGoogleSheet(payload, googleScriptUrl, { token: 'wedding-rsvp' });

  assert.equal(googleSheetsCalled, true, 'Google Sheets backup should be called');
  assert.equal(googleSheetsPayload.method, 'POST');
  assert.equal(googleSheetsPayload.mode, 'no-cors');
  assert.equal(googleSheetsPayload.body.name, 'Juan García');
  assert.equal(googleSheetsPayload.body.email, 'juan@example.com');
  assert.equal(googleSheetsPayload.body.attendance, 'acepta');
  assert.equal(googleSheetsPayload.body.sys_ref_id, 'wedding-rsvp');

  // Paso 5: Generar mailto link
  const rsvpRecipient = 'tomynahuel23@gmail.com';
  const attendanceLabel = 'Sí asistiré';
  const mailtoLink = buildMailtoLink({
    to: rsvpRecipient,
    subject: 'Confirmación de asistencia - Sergio y Carolina',
    body: [
      'Hola Sergio y Carolina',
      '',
      `Nombre: ${formData.name}`,
      `Email: ${formData.email}`,
      `Invitados: ${formData.guests}`,
      `Respuesta: ${attendanceLabel}`,
      `Mensaje: ${formData.message}`,
      '',
      'Gracias por confirmar.',
    ].join('\n'),
  });

  assert.match(mailtoLink, /^mailto:/);
  assert.match(mailtoLink, new RegExp(rsvpRecipient));
  assert.match(mailtoLink, /Juan/);
  assert.match(mailtoLink, /Garc%C3%ADa/);
  assert.match(mailtoLink, /juan%40example\.com/);
  assert.match(mailtoLink, /S%C3%AD/);


});
