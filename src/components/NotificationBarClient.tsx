'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, ArrowRight } from 'lucide-react';
import type { NotificationBarData } from '@/lib/notification-bar';

const BG: Record<NotificationBarData['bg_color'], string> = {
  gold:  'bg-gradient-to-r from-amber-500 via-gold-500 to-amber-500 text-amber-950',
  brand: 'bg-brand-950 text-white',
  green: 'bg-emerald-600 text-white',
  red:   'bg-rose-600 text-white',
  blue:  'bg-blue-600 text-white',
};

const CTA: Record<NotificationBarData['bg_color'], string> = {
  gold:  'bg-black hover:bg-zinc-800 text-white border border-black/10',
  brand: 'bg-black hover:bg-zinc-800 text-white border border-black/10',
  green: 'bg-black hover:bg-zinc-800 text-white border border-black/10',
  red:   'bg-black hover:bg-zinc-800 text-white border border-black/10',
  blue:  'bg-black hover:bg-zinc-800 text-white border border-black/10',
};

const CLOSE: Record<NotificationBarData['bg_color'], string> = {
  gold:  'hover:bg-amber-900/10 text-amber-900/60 hover:text-amber-950',
  brand: 'hover:bg-white/10 text-white/50 hover:text-white',
  green: 'hover:bg-white/10 text-white/60 hover:text-white',
  red:   'hover:bg-white/10 text-white/60 hover:text-white',
  blue:  'hover:bg-white/10 text-white/60 hover:text-white',
};

const DISMISS_KEY = (id: number) => `nb_dismissed_${id}`;

export default function NotificationBarClient({ bar }: { bar: NotificationBarData }) {
  const [visible, setVisible] = useState(false);

  // Only show after mount (avoids hydration flash) and only if not dismissed
  useEffect(() => {
    if (!bar.is_dismissible) {
      setVisible(true);
      return;
    }
    const dismissed = localStorage.getItem(DISMISS_KEY(bar.id));
    if (!dismissed) setVisible(true);
  }, [bar.id, bar.is_dismissible]);

  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    if (bar.is_dismissible) {
      localStorage.setItem(DISMISS_KEY(bar.id), '1');
    }
  };

  const bg = BG[bar.bg_color] ?? BG.gold;
  const ctaCls = CTA[bar.bg_color] ?? CTA.gold;
  const closeCls = CLOSE[bar.bg_color] ?? CLOSE.gold;

  const inner = (
    <div className="flex flex-1 items-center justify-center gap-3 flex-wrap">
      <span className="text-xs sm:text-sm font-semibold leading-snug text-center">
        {bar.text}
      </span>
      {bar.url && bar.url_label && (
        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold whitespace-nowrap transition-colors ${ctaCls}`}>
          {bar.url_label}
          <ArrowRight className="h-3 w-3" />
        </span>
      )}
    </div>
  );

  return (
    <div className={`relative z-[60] w-full px-4 py-2.5 ${bg}`}>
      <div className="mx-auto flex max-w-7xl items-center gap-3">
        {/* Clickable area */}
        {bar.url ? (
          <Link
            href={bar.url}
            className="flex flex-1 items-center justify-center gap-3 flex-wrap"
            aria-label={bar.text}
          >
            {inner}
          </Link>
        ) : (
          <div className="flex flex-1 items-center justify-center">{inner}</div>
        )}

        {/* Close button */}
        {bar.is_dismissible && (
          <button
            onClick={dismiss}
            aria-label="Dismiss notification"
            className={`shrink-0 rounded-full p-1 transition-colors ${closeCls}`}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
