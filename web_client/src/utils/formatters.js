function padNumber(value) {
  return String(value).padStart(2, '0');
}

function parseDateValue(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === 'number') {
    const parsedNumberDate = new Date(value);
    return Number.isNaN(parsedNumberDate.getTime()) ? null : parsedNumberDate;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  let normalizedValue = trimmedValue;

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmedValue)) {
    normalizedValue = `${trimmedValue}T00:00:00`;
  } else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/.test(trimmedValue)) {
    normalizedValue = trimmedValue.replace(' ', 'T');
  }

  const parsedDate = new Date(normalizedValue);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

export function formatCurrency(value) {
  return `${new Intl.NumberFormat('vi-VN').format(Number(value || 0))} đ`;
}

export function formatDate(value) {
  const parsedDate = parseDateValue(value);

  if (!parsedDate) {
    return '';
  }

  return [
    padNumber(parsedDate.getDate()),
    padNumber(parsedDate.getMonth() + 1),
    parsedDate.getFullYear(),
  ].join('/');
}

export function formatDateTime(value) {
  const parsedDate = parseDateValue(value);

  if (!parsedDate) {
    return '';
  }

  return `${formatDate(parsedDate)} ${padNumber(parsedDate.getHours())}:${padNumber(parsedDate.getMinutes())}`;
}
