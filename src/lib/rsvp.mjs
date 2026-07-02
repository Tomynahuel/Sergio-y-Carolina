export function escapeCsvValue(value) {
  const stringValue = String(value ?? '').replace(/\r?\n/g, ' ');
  return /[",\n]/.test(stringValue) ? `"${stringValue.replace(/"/g, '""')}"` : stringValue;
}

export async function backupToGoogleSheet(data, scriptUrl, opts = {}) {
  if (!scriptUrl) return;

  const formData = new FormData();
  
  // Encode token in Base64 if provided
  if (opts.token) {
    const encoded = btoa(opts.token);
    formData.append('sys_ref_id', encoded);
  }

  Object.entries(data || {}).forEach(([key, value]) => {
    formData.append(key, value == null ? '' : String(value));
  });

  await fetch(scriptUrl, {
    method: 'POST',
    mode: 'no-cors',
    body: formData,
  });
}

export function buildGuestCsv(entries) {
  const header = ['nombre', 'email', 'invitados', 'asistencia', 'mensaje'];
  const rows = entries.map((entry) => [
    entry.name,
    entry.email,
    entry.guests,
    entry.attendance,
    entry.message,
  ]);

  return [header, ...rows].map((row) => row.map(escapeCsvValue).join(',')).join('\n');
}

export function buildMailtoLink({ to, subject, body }) {
  const params = new URLSearchParams({ subject, body });
  return `mailto:${to}?${params.toString()}`;
}
