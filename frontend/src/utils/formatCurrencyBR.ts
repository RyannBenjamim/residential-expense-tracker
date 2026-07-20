export const formatCurrencyBR = (value: number | string, decimals = 2): string => {
  const numberValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numberValue)) return '0,00';

  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(numberValue);
};