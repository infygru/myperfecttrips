import { send2FactorOTP, verify2FactorOTP } from './sms';

interface OTPEntry {
    otp: string;
    expires: number;
    attempts: number;
    sessionId?: string; // 2Factor.in session
}

// Persist across Next.js hot reloads in dev
const g = globalThis as any;
if (!g.__otpStore) g.__otpStore = new Map<string, OTPEntry>();
const store: Map<string, OTPEntry> = g.__otpStore;

export function generateOTP(phone: string): string {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    store.set(phone, { otp, expires: Date.now() + 10 * 60 * 1000, attempts: 0 });
    return otp;
}

export function verifyOTP(phone: string, otp: string): boolean {
    const entry = store.get(phone);
    if (!entry) return false;
    if (Date.now() > entry.expires) { store.delete(phone); return false; }
    if (entry.attempts >= 5) { store.delete(phone); return false; }
    entry.attempts++;
    if (entry.otp === otp.trim()) { store.delete(phone); return true; }
    return false;
}

export function storeSessionOTP(phone: string, sessionId: string) {
    // Store a sentinel so verify-otp knows to use 2Factor
    store.set(phone, { otp: '__2factor__', sessionId, expires: Date.now() + 10 * 60 * 1000, attempts: 0 });
}

export async function sendOTP(phone: string): Promise<{ sent: boolean; method: 'sms' | 'console' | 'none' }> {
    const normalized = phone.replace(/\D/g, '').slice(-10);
    if (normalized.length !== 10) return { sent: false, method: 'none' };

    // Try 2Factor.in first (free, India)
    const sessionId = await send2FactorOTP(normalized);
    if (sessionId) {
        storeSessionOTP(normalized, sessionId);
        return { sent: true, method: 'sms' };
    }

    // Fallback: generate OTP internally and log to console (dev/staging)
    const otp = generateOTP(normalized);
    console.log(`[OTP FALLBACK] Phone: +91${normalized} → OTP: ${otp}`);
    // In dev/staging, return OTP in response for testing
    if (process.env.NODE_ENV !== 'production') {
        (g.__otpStore as Map<string, OTPEntry>).get(normalized)!.otp = otp;
        return { sent: true, method: 'console' };
    }

    return { sent: false, method: 'none' };
}

export async function verifyOTPWithSession(phone: string, otp: string): Promise<boolean> {
    const entry = store.get(phone);
    if (!entry) return false;

    // 2Factor session-based verification
    if (entry.otp === '__2factor__' && entry.sessionId) {
        if (Date.now() > entry.expires) { store.delete(phone); return false; }
        const ok = await verify2FactorOTP(entry.sessionId, otp.trim());
        if (ok) store.delete(phone);
        return ok;
    }

    // In-memory fallback
    return verifyOTP(phone, otp);
}
