import { sendSMS } from './sms';

interface OTPEntry {
    otp: string;
    expires: number;
    attempts: number;
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

// Alias for verify-otp route compatibility
export async function verifyOTPWithSession(phone: string, otp: string): Promise<boolean> {
    return verifyOTP(phone, otp);
}

export async function sendOTP(phone: string): Promise<boolean> {
    const normalized = phone.replace(/\D/g, '').slice(-10);
    if (normalized.length !== 10) return false;
    const otp = generateOTP(normalized);
    const msg = `${otp} is your My Perfect Trips verification code. Valid for 10 minutes. Do not share with anyone.`;
    const sent = await sendSMS(normalized, msg);
    if (!sent) {
        // Log OTP to console as fallback so it's testable
        console.log(`[OTP] Phone: +91${normalized} OTP: ${otp}`);
    }
    return sent;
}
