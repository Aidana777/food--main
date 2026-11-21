export function formatPrice(amount: number): string {
  return `${new Intl.NumberFormat('ru-RU').format(amount)} ₽`;
}
