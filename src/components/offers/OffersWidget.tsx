import { getActiveOffers, type PaymentOffer } from '@/lib/offers';
import { CreditCard, Smartphone, Building2, Wallet, Calendar, Tag, ChevronRight, Clock } from 'lucide-react';

const COLOR = {
  blue:   { row: 'bg-blue-50 border-blue-100',     badge: 'bg-blue-100 text-blue-700',   icon: 'text-blue-600',   title: 'text-blue-900',   sub: 'text-blue-600'   },
  purple: { row: 'bg-purple-50 border-purple-100', badge: 'bg-purple-100 text-purple-700', icon: 'text-purple-600', title: 'text-purple-900', sub: 'text-purple-600' },
  green:  { row: 'bg-emerald-50 border-emerald-100', badge: 'bg-emerald-100 text-emerald-700', icon: 'text-emerald-600', title: 'text-emerald-900', sub: 'text-emerald-600' },
  orange: { row: 'bg-orange-50 border-orange-100', badge: 'bg-orange-100 text-orange-700', icon: 'text-orange-600', title: 'text-orange-900', sub: 'text-orange-600' },
  amber:  { row: 'bg-amber-50 border-amber-100',   badge: 'bg-amber-100 text-amber-700',  icon: 'text-amber-600',  title: 'text-amber-900',  sub: 'text-amber-600'  },
} satisfies Record<string, Record<string, string>>;

const METHOD_ICON = {
  card: CreditCard,
  upi: Smartphone,
  netbanking: Building2,
  wallet: Wallet,
  emi: Calendar,
  all: Tag,
};

function OfferRow({ offer }: { offer: PaymentOffer }) {
  const c = COLOR[offer.badge_color] ?? COLOR.blue;
  const Icon = METHOD_ICON[offer.payment_method] ?? Tag;

  const expiresAt = offer.valid_until ? new Date(offer.valid_until) : null;
  const daysLeft = expiresAt
    ? Math.ceil((expiresAt.getTime() - Date.now()) / 86_400_000)
    : null;

  return (
    <div className={`flex items-start gap-3 rounded-xl border px-3.5 py-3 ${c.row}`}>
      {/* Icon */}
      <div className={`mt-0.5 shrink-0 ${c.icon}`}>
        <Icon className="h-4 w-4" />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-bold ${c.title}`}>{offer.title}</span>
          <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-black tracking-wide ${c.badge}`}>
            {offer.discount_label}
          </span>
        </div>
        {offer.subtitle && (
          <p className={`text-[11px] mt-0.5 leading-relaxed ${c.sub} opacity-80`}>
            {offer.subtitle}
          </p>
        )}
        {daysLeft !== null && daysLeft <= 7 && (
          <p className={`flex items-center gap-1 text-[10px] font-semibold mt-1 ${c.sub}`}>
            <Clock className="h-3 w-3" />
            {daysLeft <= 1 ? 'Expires today!' : `${daysLeft}d left`}
          </p>
        )}
        {offer.terms && (
          <p className={`text-[10px] mt-1 ${c.sub} opacity-60`}>{offer.terms}</p>
        )}
      </div>
    </div>
  );
}

// ── Public component ────────────────────────────────────────────────────────
export default async function OffersWidget() {
  const offers = await getActiveOffers();
  if (!offers.length) return null;

  return (
    <div className="rounded-2xl border border-gold-200 bg-gold-50/40 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gold-200/60">
        <Tag className="h-3.5 w-3.5 text-gold-600" />
        <h3 className="text-xs font-bold text-gold-900 uppercase tracking-widest">Available Offers</h3>
        <ChevronRight className="ml-auto h-3.5 w-3.5 text-gold-400" />
      </div>

      {/* Offer rows */}
      <div className="p-3 space-y-2">
        {offers.map((offer) => (
          <OfferRow key={offer.id} offer={offer} />
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-gold-200/60 text-[10px] text-gold-700/70 font-medium leading-relaxed">
        Select the matching payment method in Razorpay to redeem automatically.
      </div>
    </div>
  );
}
