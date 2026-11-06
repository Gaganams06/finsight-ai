export function formatCurrency(amount, currency = '₹') {
  if (amount === undefined || amount === null || isNaN(amount)) return `${currency}0`;
  const num = Number(amount);
  const isNegative = num < 0;
  const absNum = Math.abs(num);

  let formatted = '';
  if (currency === '₹') {
    // Indian Numbering format (Lakhs/Crores)
    formatted = absNum.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  } else {
    formatted = absNum.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  return `${isNegative ? '-' : ''}${currency}${formatted}`;
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function maskAccount(acc) {
  if (!acc) return '•••• •••• 8294';
  return acc;
}
