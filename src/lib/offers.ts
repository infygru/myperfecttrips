export interface PaymentOffer {
  id: number;
  title: string;
  subtitle: string | null;
  payment_method: 'all' | 'card' | 'upi' | 'netbanking' | 'wallet' | 'emi';
  discount_label: string;
  badge_color: 'blue' | 'purple' | 'green' | 'orange' | 'amber';
  terms: string | null;
  valid_until: string | null;
  sort: number | null;
}

const DEFAULT_OFFERS: PaymentOffer[] = [
  {
    id: 1,
    title: '10% off on Credit Cards',
    subtitle: 'Valid on Visa, Mastercard & RuPay credit cards',
    payment_method: 'card',
    discount_label: '10% OFF',
    badge_color: 'blue',
    terms: 'Max discount £1,000. Min booking £10,000. T&C apply.',
    valid_until: null,
    sort: 1,
  },
  {
    id: 2,
    title: 'Flat £200 off on UPI',
    subtitle: 'Pay via PhonePe, Google Pay, Paytm or any UPI app',
    payment_method: 'upi',
    discount_label: '£200 OFF',
    badge_color: 'purple',
    terms: 'Min booking £5,000. T&C apply.',
    valid_until: null,
    sort: 2,
  },
  {
    id: 3,
    title: '5% cashback on Net Banking',
    subtitle: 'Valid on all major Indian banks',
    payment_method: 'netbanking',
    discount_label: '5% BACK',
    badge_color: 'green',
    terms: 'Max cashback £500. T&C apply.',
    valid_until: null,
    sort: 3,
  },
  {
    id: 4,
    title: 'No-cost EMI available',
    subtitle: 'Convert your booking to easy monthly instalments',
    payment_method: 'emi',
    discount_label: '0% EMI',
    badge_color: 'amber',
    terms: 'Available on select credit cards at checkout.',
    valid_until: null,
    sort: 4,
  },
];

export async function getActiveOffers(): Promise<PaymentOffer[]> {
  const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
  try {
    const res = await fetch(
      `${DIRECTUS_URL}/items/payment_offers?filter[is_active][_eq]=true&sort=sort&fields=id,title,subtitle,payment_method,discount_label,badge_color,terms,valid_until,sort`,
      { next: { revalidate: 300 } } // cache 5 min
    );
    if (!res.ok) return DEFAULT_OFFERS;
    const json = await res.json();
    const items: PaymentOffer[] = json?.data ?? [];
    if (!items.length) return DEFAULT_OFFERS;

    // Filter out expired offers
    const now = Date.now();
    return items.filter((o) => !o.valid_until || new Date(o.valid_until).getTime() > now);
  } catch {
    return DEFAULT_OFFERS;
  }
}
