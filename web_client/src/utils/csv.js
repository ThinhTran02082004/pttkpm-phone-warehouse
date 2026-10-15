function escapeCsvValue(value) {
  const normalizedValue = value == null ? '' : String(value);

  if (normalizedValue.includes('"') || normalizedValue.includes(',') || normalizedValue.includes('\n')) {
    return `"${normalizedValue.replace(/"/g, '""')}"`;
  }

  return normalizedValue;
}

export function downloadCsv(fileName, headers, rows) {
  const csvLines = [
    headers.map((header) => escapeCsvValue(header)).join(','),
    ...rows.map((row) => row.map((cell) => escapeCsvValue(cell)).join(',')),
  ];

  const blob = new Blob([`\uFEFF${csvLines.join('\n')}`], {
    type: 'text/csv;charset=utf-8;',
  });

  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = objectUrl;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(objectUrl);
}
