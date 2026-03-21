import crypto from 'crypto';

const MERCHANT_ID = process.env.PAYTM_MERCHANT_ID!;
const MERCHANT_KEY = process.env.PAYTM_MERCHANT_KEY!;
const WEBSITE = process.env.PAYTM_WEBSITE || 'DEFAULT';
const CHANNEL_ID = process.env.PAYTM_CHANNEL_ID || 'WEB';
const INDUSTRY_TYPE = process.env.PAYTM_INDUSTRY_TYPE || 'Retail';
const PAYTM_BASE_URL = 'https://securegw.paytm.in';

export function generateSignature(body: object): string {
    const bodyStr = JSON.stringify(body);
    return crypto
        .createHmac('sha256', MERCHANT_KEY)
        .update(bodyStr)
        .digest()
        .toString('base64');
}

export function verifySignature(body: object, signature: string): boolean {
    try {
        const expected = generateSignature(body);
        return expected === signature;
    } catch {
        return false;
    }
}

export function verifyCallbackChecksum(
    params: Record<string, string>,
    checksumHash: string
): boolean {
    try {
        const decoded = Buffer.from(checksumHash, 'base64').toString();
        const salt = decoded.slice(-8);
        const hash = decoded.slice(0, -8);

        const sortedKeys = Object.keys(params)
            .filter(k => k !== 'CHECKSUMHASH')
            .sort();
        const paramStr = sortedKeys
            .map(k => (params[k] === undefined ? 'null' : params[k]))
            .join('|');
        const finalStr = paramStr + '|' + salt;
        const computedHash = crypto.createHash('sha256').update(finalStr).digest('hex');
        return computedHash === hash;
    } catch {
        return false;
    }
}

export async function initiateTransaction(params: {
    orderId: string;
    amount: number;
    customerId: string;
    customerEmail?: string;
    customerPhone?: string;
    callbackUrl: string;
}): Promise<{ txnToken: string; orderId: string }> {
    const body = {
        requestType: 'Payment',
        mid: MERCHANT_ID,
        websiteName: WEBSITE,
        orderId: params.orderId,
        callbackUrl: params.callbackUrl,
        txnAmount: {
            value: params.amount.toFixed(2),
            currency: 'INR',
        },
        userInfo: {
            custId: params.customerId,
            ...(params.customerEmail && { email: params.customerEmail }),
            ...(params.customerPhone && { mobile: params.customerPhone }),
        },
    };

    const signature = generateSignature(body);

    const res = await fetch(
        `${PAYTM_BASE_URL}/theia/api/v1/initiateTransaction?mid=${MERCHANT_ID}&orderId=${params.orderId}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ body, head: { signature } }),
        }
    );

    const data = await res.json();

    if (data?.body?.resultInfo?.resultStatus !== 'S') {
        throw new Error(data?.body?.resultInfo?.resultMsg || 'PayTM initiation failed');
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
    const signature = generateSignature(body);

    const res = await fetch(
        `${PAYTM_BASE_URL}/v3/order/status`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ body, head: { signature } }),
        }
    );

    const data = await res.json();
    const resultInfo = data?.body?.resultInfo;
    return {
        status: resultInfo?.resultStatus || 'TXN_FAILURE',
        txnId: data?.body?.txnId,
        amount: data?.body?.txnAmount,
        respMsg: resultInfo?.resultMsg,
    };
}

export const PAYTM_PAYMENT_URL = `${PAYTM_BASE_URL}/theia/api/v1/showPaymentPage`;
export { MERCHANT_ID, WEBSITE };
