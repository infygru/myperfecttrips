import PaytmChecksum from 'paytmchecksum';

const MERCHANT_ID  = process.env.PAYTM_MERCHANT_ID!;
const MERCHANT_KEY = process.env.PAYTM_MERCHANT_KEY!;
const WEBSITE      = process.env.PAYTM_WEBSITE || 'DEFAULT';
const CHANNEL_ID   = process.env.PAYTM_CHANNEL_ID || 'WEB';
const PAYTM_BASE_URL = 'https://securegw.paytm.in';

export async function initiateTransaction(params: {
    orderId: string;
    amount: number;
    customerId: string;
    customerEmail?: string;
    customerPhone?: string;
    callbackUrl: string;
}): Promise<{ txnToken: string; orderId: string }> {
    // custId: alphanumeric only, max 64 chars
    const custId = params.customerId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 64);

    // PayTM requires 10-digit mobile (no country code)
    const rawPhone = (params.customerPhone || '').replace(/\D/g, '');
    const mobile   = rawPhone.length >= 10 ? rawPhone.slice(-10) : undefined;

    const body: Record<string, any> = {
        requestType: 'Payment',
        mid:         MERCHANT_ID,
        websiteName: WEBSITE,
        orderId:     params.orderId,
        callbackUrl: params.callbackUrl,
        txnAmount: {
            value:    params.amount.toFixed(2),
            currency: 'INR',
        },
        userInfo: {
            custId,
            ...(params.customerEmail && { email: params.customerEmail }),
            ...(mobile && { mobile }),
        },
    };

    // Generate signature using official Paytm library
    const signature = await PaytmChecksum.generateSignatureByObject(body, MERCHANT_KEY);

    const payload = {
        body,
        head: {
            version:          'v1',
            requestTimestamp: String(Math.floor(Date.now() / 1000)),
            channelId:        CHANNEL_ID,
            signature,
        },
    };

    const url = `${PAYTM_BASE_URL}/theia/api/v1/initiateTransaction?mid=${MERCHANT_ID}&orderId=${params.orderId}`;

    const res  = await fetch(url, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
    });

    const data = await res.json();

    if (data?.body?.resultInfo?.resultStatus !== 'S') {
        const msg = data?.body?.resultInfo?.resultMsg || 'PayTM initiation failed';
        const code = data?.body?.resultInfo?.resultCode || 'unknown';
        throw new Error(`[PayTM ${code}] ${msg}`);
    }

    return { txnToken: data.body.txnToken, orderId: params.orderId };
}

export async function verifyTransaction(orderId: string): Promise<{
    status: 'TXN_SUCCESS' | 'TXN_FAILURE' | 'PENDING';
    txnId?: string;
    amount?: string;
    respMsg?: string;
}> {
    const body = { mid: MERCHANT_ID, orderId };
    const signature = await PaytmChecksum.generateSignatureByObject(body, MERCHANT_KEY);

    const res = await fetch(`${PAYTM_BASE_URL}/v3/order/status`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
            body,
            head: {
                version:   'v1',
                signature,
            },
        }),
    });

    const data = await res.json();
    const info = data?.body?.resultInfo;
    return {
        status:  info?.resultStatus || 'TXN_FAILURE',
        txnId:   data?.body?.txnId,
        amount:  data?.body?.txnAmount,
        respMsg: info?.resultMsg,
    };
}

export async function verifyCallbackChecksum(
    params: Record<string, string>,
    checksumHash: string
): Promise<boolean> {
    try {
        return await PaytmChecksum.verifySignature(params, MERCHANT_KEY, checksumHash);
    } catch {
        return false;
    }
}

export const PAYTM_PAYMENT_URL = `${PAYTM_BASE_URL}/theia/api/v1/showPaymentPage`;
export { MERCHANT_ID, WEBSITE };
