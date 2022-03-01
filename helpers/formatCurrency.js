const formatToUSDollars = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
});

export default function formatCurrency(amount) {
  return formatToUSDollars.format(amount);
}
