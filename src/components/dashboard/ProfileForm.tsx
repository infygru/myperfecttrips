'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Phone, Save } from 'lucide-react';

export default function ProfileForm({ user }: { user: any }) {
    const [form, setForm] = useState({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
    });
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const { refresh } = useAuth();

    const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm(f => ({ ...f, [k]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSuccess(false);
        setError('');
        try {
            const apiRes = await fetch('/api/auth/update-profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await apiRes.json();
            if (!apiRes.ok) throw new Error(data.error || 'Update failed');
            setSuccess(true);
            await refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm max-w-xl">
            <form onSubmit={handleSubmit} className="space-y-5">
                {success && (
                    <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                        Profile updated successfully!
                    </div>
                )}
                {error && (
                    <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">First name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                            <input
                                type="text" required value={form.first_name} onChange={set('first_name')}
                                className="w-full rounded-xl border border-stone-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Last name</label>
                        <input
                            type="text" required value={form.last_name} onChange={set('last_name')}
                            className="w-full rounded-xl border border-stone-200 py-2.5 px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Email address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                        <input
                            type="email" value={user.email} disabled
                            className="w-full rounded-xl border border-stone-100 bg-stone-50 py-2.5 pl-9 pr-3 text-sm text-stone-400 cursor-not-allowed"
                        />
                    </div>
                    <p className="text-xs text-stone-400 mt-1">Email cannot be changed here. Contact support.</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Phone number</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                        <input
                            type="tel" value={form.phone} onChange={set('phone')}
                            placeholder="+91 98765 43210"
                            className="w-full rounded-xl border border-stone-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all"
                        />
                    </div>
                </div>

                <button
                    type="submit" disabled={saving}
                    className="btn-primary w-full justify-center py-2.5 disabled:opacity-60"
                >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save changes'}
                </button>
            </form>
        </div>
    );
}
