'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CancelBookingButton({ bookingId }: { bookingId: string }) {
    const [loading, setLoading] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const router = useRouter();

    if (!confirmed) {
        return (
            <button
                onClick={() => setConfirmed(true)}
                className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
                Request Cancellation
            </button>
        );
    }

    const cancel = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/bookings/${bookingId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'cancelled' }),
            });
            if (res.ok) {
                router.refresh();
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-3">
            <p className="text-sm text-red-700 font-medium">Are you sure?</p>
            <button
                onClick={cancel}
                disabled={loading}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60 transition-colors"
            >
                {loading ? 'Cancelling...' : 'Yes, cancel it'}
            </button>
            <button
                onClick={() => setConfirmed(false)}
                className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors"
            >
                Keep booking
            </button>
        </div>
    );
}
