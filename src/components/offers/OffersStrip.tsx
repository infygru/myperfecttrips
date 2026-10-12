import { getActiveOffers, type PaymentOffer } from '@/lib/offers';
import { CreditCard, Smartphone, Building2, Wallet, Calendar, Tag, Clock, Sparkles } from 'lucide-react';

// ── colour tokens per badge_color ──────────────────────────────────────────
const COLOR = {
  blue: {
    card: 'bg-gradient-to-br from-blue-50 to-blue-100/60 border-blue-200/80',
    badge: 'bg-blue-600 text-white shadow-blue-200 shadow-sm',
    icon: 'bg-blue-600 text-white shadow-sm shadow-blue-300',
    title: 'text-blue-950',
    sub: 'text-blue-700',
    terms: 'text-blue-500',
    accent: 'text-blue-600',
    divider: 'border-blue-200/60',
  },
  purple: {
    card: 'bg-gradient-to-br from-purple-50 to-purple-100/60 border-purple-200/80',
    badge: 'bg-purple-600 text-white shadow-purple-200 shadow-sm',
    icon: 'bg-purple-600 text-white shadow-sm shadow-purple-300',
    title: 'text-purple-950',
    sub: 'text-purple-700',
    terms: 'text-purple-500',
    accent: 'text-purple-600',
    divider: 'border-purple-200/60',
  },
  green: {
    card: 'bg-gradient-to-br from-emerald-50 to-emerald-100/60 border-emerald-200/80',
    badge: 'bg-emerald-600 text-white shadow-emerald-200 shadow-sm',
    icon: 'bg-emerald-600 text-white shadow-sm shadow-emerald-300',
    title: 'text-emerald-950',
    sub: 'text-emerald-700',
    terms: 'text-emerald-500',
    accent: 'text-emerald-600',
    divider: 'border-emerald-200/60',
  },
  orange: {
    card: 'bg-gradient-to-br from-orange-50 to-orange-100/60 border-orange-200/80',
    badge: 'bg-orange-600 text-white shadow-orange-200 shadow-sm',
    icon: 'bg-orange-600 text-white shadow-sm shadow-orange-300',
    title: 'text-orange-950',
    sub: 'text-orange-700',
    terms: 'text-orange-500',
    accent: 'text-orange-600',
    divider: 'border-orange-200/60',
  },
  amber: {
    card: 'bg-gradient-to-br from-amber-50 to-amber-100/60 border-amber-200/80',
    badge: 'bg-amber-500 text-white shadow-amber-200 shadow-sm',
    icon: 'bg-amber-500 text-white shadow-sm shadow-amber-300',
    title: 'text-amber-950',
    sub: 'text-amber-700',
    terms: 'text-amber-500',
    accent: 'text-amber-600',
    divider: 'border-amber-200/60',
  },
} satisfies Record<string, Record<string, string>>;

const METHOD_ICON = {
  card: CreditCard,
  upi: Smartphone,
  netbanking: Building2,
  wallet: Wallet,
  emi: Calendar,
  all: Tag,
};

const METHOD_LABEL = {
  card: 'Credit / Debit Card',
  upi: 'UPI',
  netbanking: 'Net Banking',
  wallet: 'Wallet',
  emi: 'No-cost EMI',
  all: 'All Methods',
};

function OfferCard({ offer }: { offer: PaymentOffer }) {
  const c = COLOR[offer.badge_color] ?? COLOR.blue;
  const Icon = METHOD_ICON[offer.payment_method] ?? Tag;
  const methodLabel = METHOD_LABEL[offer.payment_method] ?? offer.payment_method;

  const expiresAt = offer.valid_until ? new Date(offer.valid_until) : null;
  const daysLeft = expiresAt
    ? Math.ceil((expiresAt.getTime() - Date.now()) / 86_400_000)
    : null;

  return (
    <div className={`relative flex-shrink-0 w-60 rounded-2xl border p-5 flex flex-col gap-3 overflow-hidden ${c.card}`}>
      {/* Discount badge — top-right ribbon */}
      <div className={`absolute top-0 right-0 rounded-bl-2xl rounded-tr-2xl px-3.5 py-1.5 text-[11px] font-black tracking-wide ${c.badge}`}>
        {offer.discount_label}
      </div>

      {/* Icon + method */}
      <div className="flex items-center gap-3 mt-1">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${c.icon}`}>
          <Icon className="h-4 w-4" />
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-widest ${c.sub}`}>
          {methodLabel}
        </span>
      </div>

      {/* Title */}
      <p className={`text-sm font-bold leading-snug pr-12 ${c.title}`}>
        {offer.title}
      </p>

      {/* Subtitle */}
      {offer.subtitle && (
        <p className={`text-xs leading-relaxed ${c.sub} opacity-90`}>
          {offer.subtitle}
        </p>
      )}

      {/* Footer: expiry + terms */}
      <div className={`mt-auto pt-3 border-t ${c.divider} space-y-1`}>
        {daysLeft !== null && daysLeft <= 30 && (
          <div className={`flex items-center gap-1 text-[10px] font-semibold ${c.accent}`}>
            <Clock className="h-3 w-3" />
            {daysLeft <= 1 ? 'Expires today!' : `Expires in ${daysLeft} days`}
          </div>
        )}
        {offer.terms && (
          <p className={`text-[10px] leading-relaxed ${c.terms}`}>
            {offer.terms}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Public component ────────────────────────────────────────────────────────
export default async function OffersStrip() {
  const offers = await getActiveOffers();
  if (!offers.length) return null;

  return (
    <div className="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-stone-100 bg-gradient-to-r from-stone-50 to-white">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-100">
          <Sparkles className="h-4 w-4 text-gold-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-stone-900">Offers &amp; Savings</h3>
          <p className="text-[10px] text-stone-400 font-medium">Applied automatically at checkout</p>
        </div>
        <span className="ml-auto inline-flex items-center rounded-full bg-gold-100 px-2.5 py-1 text-[10px] font-bold text-gold-700 uppercase tracking-wider">
          {offers.length} Active
        </span>
      </div>

      {/* Horizontal scroll */}
      <div className="px-5 py-5 overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 w-max">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      </div>

      {/* Footer note */}
      <div className="px-5 py-3 bg-stone-50 border-t border-stone-100 text-[10px] text-stone-400 font-medium">
        Select the matching payment method in Razorpay checkout to redeem your discount.
      </div>
    </div>
  );
}
