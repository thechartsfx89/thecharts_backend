// Payments made before the catalogue change have no currency recorded and were all in rupees
export const formatMoney = (amount: unknown, currency?: string | null) => `${currency === 'USD' ? '$' : '₹'}${amount ?? ''}`;
