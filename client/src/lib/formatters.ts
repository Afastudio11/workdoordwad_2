export function formatSalary(amount: number): string {
  if (amount >= 1000000) {
    const juta = (amount / 1000000).toFixed(amount % 1000000 === 0 ? 0 : 1);
    return `Rp ${juta} juta`;
  }
  if (amount >= 1000) {
    const ribu = (amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1);
    return `Rp ${ribu} ribu`;
  }
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
