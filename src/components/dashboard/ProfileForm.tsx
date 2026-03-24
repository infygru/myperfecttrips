'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Phone, Save, Lock, Eye, EyeOff, Camera, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { getUserDisplayName, getUserInitials } from '@/context/AuthContext';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://api.myperfecttrips.com';

export default function ProfileForm({ user }: { user: any }) {
    const { refresh } = useAuth();

    // ── Personal info ──────────────────────────────────────────────────────
    const [info, setInfo] = useState({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
    });
    const [infoSaving, setInfoSaving] = useState(false);
    const [infoSuccess, setInfoSuccess] = useState(false);
    const [infoError, setInfoError] = useState('');

    // ── Avatar ─────────────────────────────────────────────────────────────
    const resolvedAvatar = user.avatar
        ? `${DIRECTUS_URL}/assets/${user.avatar}`
        : user.default_avatar_url || null;
    const [avatarUrl, setAvatarUrl] = useState<string | null>(resolvedAvatar);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const [avatarError, setAvatarError] = useState('');
    const fileRef = useRef<HTMLInputElement>(null);

    // ── Change password ────────────────────────────────────────────────────
    const [pw, setPw] = useState({ current: '', new: '', confirm: '' });
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [pwSaving, setPwSaving] = useState(false);
    const [pwSuccess, setPwSuccess] = useState(false);
    const [pwError, setPwError] = useState('');

    const initials = getUserInitials(user);
    const displayName = getUserDisplayName(user);

    // ── Handlers ───────────────────────────────────────────────────────────

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarUploading(true);
        setAvatarError('');
        try {
            const fd = new FormData();
            fd.append('avatar', file);
            const res = await fetch('/api/auth/upload-avatar', { method: 'POST', body: fd });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Upload failed');
            setAvatarUrl(data.avatar_url);
            await refresh();
        } catch (err: any) {
            setAvatarError(err.message);
        } finally {
            setAvatarUploading(false);
            if (fileRef.current) fileRef.current.value = '';
        }
    };

    const handleInfoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setInfoSaving(true);
        setInfoSuccess(false);
        setInfoError('');
        try {
            const res = await fetch('/api/auth/update-profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(info),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Update failed');
            setInfoSuccess(true);
            await refresh();
            setTimeout(() => setInfoSuccess(false), 3000);
        } catch (err: any) {
            setInfoError(err.message);
        } finally {
            setInfoSaving(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPwError('');
        setPwSuccess(false);
        if (pw.new !== pw.confirm) {
            setPwError('New passwords do not match');
            return;
        }
        if (pw.new.length < 8) {
            setPwError('New password must be at least 8 characters');
            return;
        }
        setPwSaving(true);
        try {
            const res = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ current_password: pw.current, new_password: pw.new }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Password change failed');
            setPwSuccess(true);
            setPw({ current: '', new: '', confirm: '' });
            setTimeout(() => setPwSuccess(false), 4000);
        } catch (err: any) {
            setPwError(err.message);
        } finally {
            setPwSaving(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl">

            {/* ── Avatar + name ── */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
                <h2 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-5">Profile Photo</h2>
                <div className="flex items-center gap-5">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                        <div className="h-20 w-20 rounded-2xl overflow-hidden border-2 border-stone-200 bg-brand-900 flex items-center justify-center">
                            {avatarUrl ? (
                                <Image
                                    src={avatarUrl}
                                    alt="Profile photo"
                                    width={80} height={80}
                                    className="h-full w-full object-cover"
                                    unoptimized
                                />
                            ) : (
                                <span className="text-2xl font-bold text-white">{initials}</span>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            disabled={avatarUploading}
                            className="absolute -bottom-1.5 -right-1.5 h-7 w-7 rounded-full bg-brand-900 hover:bg-brand-800 border-2 border-white flex items-center justify-center transition-colors disabled:opacity-60"
                            title="Change photo"
                        >
                            <Camera className="h-3.5 w-3.5 text-white" />
                        </button>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                        />
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-stone-800">
                            {displayName}
                        </p>
                        <p className="text-xs text-stone-400 mt-0.5">{user.email}</p>
                        <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            disabled={avatarUploading}
                            className="mt-2.5 text-xs font-semibold text-brand-700 hover:text-brand-900 transition-colors disabled:opacity-60"
                        >
                            {avatarUploading ? 'Uploading…' : avatarUrl ? 'Change photo' : 'Upload photo'}
                        </button>
                        <p className="text-[11px] text-stone-400 mt-0.5">JPG, PNG or WEBP · max 2 MB</p>
                        {avatarError && <p className="text-xs text-red-500 mt-1">{avatarError}</p>}
                    </div>
                </div>
            </div>

            {/* ── Personal info ── */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
                <h2 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-5">Personal Information</h2>
                <form onSubmit={handleInfoSubmit} className="space-y-4">
                    {infoSuccess && (
                        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                            <span className="text-sm text-emerald-700">Profile updated successfully!</span>
                        </div>
                    )}
                    {infoError && (
                        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{infoError}</div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-stone-600 mb-1.5">First name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
                                <input
                                    type="text" required
                                    value={info.first_name}
                                    onChange={e => setInfo(f => ({ ...f, first_name: e.target.value }))}
                                    className="w-full rounded-xl border border-stone-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-stone-600 mb-1.5">Last name</label>
                            <input
                                type="text" required
                                value={info.last_name}
                                onChange={e => setInfo(f => ({ ...f, last_name: e.target.value }))}
                                className="w-full rounded-xl border border-stone-200 py-2.5 px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1.5">Email address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-300 pointer-events-none" />
                            <input
                                type="email" value={user.email} disabled
                                className="w-full rounded-xl border border-stone-100 bg-stone-50 py-2.5 pl-9 pr-3 text-sm text-stone-400 cursor-not-allowed"
                            />
                        </div>
                        <p className="text-[11px] text-stone-400 mt-1">Email cannot be changed. Contact support if needed.</p>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1.5">Phone number</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
                            <input
                                type="tel"
                                value={info.phone}
                                onChange={e => setInfo(f => ({ ...f, phone: e.target.value }))}
                                placeholder="+91 98765 43210"
                                className="w-full rounded-xl border border-stone-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all"
                            />
                        </div>
                    </div>

                    <button
                        type="submit" disabled={infoSaving}
                        className="inline-flex items-center gap-2 rounded-xl bg-brand-900 hover:bg-brand-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-60"
                    >
                        <Save className="h-4 w-4" />
                        {infoSaving ? 'Saving…' : 'Save changes'}
                    </button>
                </form>
            </div>

            {/* ── Change password ── */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
                <h2 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-1">Change Password</h2>
                <p className="text-xs text-stone-400 mb-5">Choose a strong password of at least 8 characters.</p>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    {pwSuccess && (
                        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                            <span className="text-sm text-emerald-700">Password changed successfully!</span>
                        </div>
                    )}
                    {pwError && (
                        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{pwError}</div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1.5">Current password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
                            <input
                                type={showCurrent ? 'text' : 'password'} required
                                value={pw.current}
                                onChange={e => setPw(p => ({ ...p, current: e.target.value }))}
                                placeholder="Enter current password"
                                className="w-full rounded-xl border border-stone-200 py-2.5 pl-9 pr-10 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all"
                            />
                            <button type="button" onClick={() => setShowCurrent(s => !s)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1.5">New password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
                            <input
                                type={showNew ? 'text' : 'password'} required
                                value={pw.new}
                                onChange={e => setPw(p => ({ ...p, new: e.target.value }))}
                                placeholder="Min. 8 characters"
                                className="w-full rounded-xl border border-stone-200 py-2.5 pl-9 pr-10 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all"
                            />
                            <button type="button" onClick={() => setShowNew(s => !s)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1.5">Confirm new password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
                            <input
                                type="password" required
                                value={pw.confirm}
                                onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))}
                                placeholder="Re-enter new password"
                                className="w-full rounded-xl border border-stone-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all"
                            />
                        </div>
                    </div>

                    <button
                        type="submit" disabled={pwSaving}
                        className="inline-flex items-center gap-2 rounded-xl bg-brand-900 hover:bg-brand-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-60"
                    >
                        <Lock className="h-4 w-4" />
                        {pwSaving ? 'Updating…' : 'Update password'}
                    </button>
                </form>
            </div>
        </div>
    );
}
