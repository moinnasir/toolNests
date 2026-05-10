import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.formData();
  const plan = String(body.get('plan') || '');
  const amount = String(body.get('amount') || '');
  const storeId = process.env.EASYPAISA_STORE_ID;
  const hashKey = process.env.EASYPAISA_HASH_KEY;
  const accountNum = process.env.EASYPAISA_ACCOUNT_NUM;
  const returnUrl = process.env.EASYPAISA_RETURN_URL || `${req.nextUrl.origin}/subscription?easypaisa=1`;
  const endpoint = process.env.EASYPAISA_CHECKOUT_URL || 'https://easypay.easypaisa.com.pk/easypay/Index.jsf';

  if (!plan || !amount) return NextResponse.json({ error: 'Missing plan or amount' }, { status: 400 });
  if (!storeId || !hashKey || !accountNum) {
    return NextResponse.json({ error: 'EasyPaisa payment method is not configured. Add EASYPAISA_STORE_ID, EASYPAISA_HASH_KEY, and EASYPAISA_ACCOUNT_NUM.' }, { status: 500 });
  }

  const orderRefNum = `TN-${Date.now()}`;
  const postBackURL = returnUrl;
  const values = {
    amount,
    autoRedirect: '1',
    emailAddr: '',
    expiryDate: '',
    merchantHashedReq: '',
    orderRefNum,
    paymentMethod: 'OTC_PAYMENT_METHOD',
    postBackURL,
    storeId,
  };
  const hashString = Object.entries(values)
    .filter(([key]) => key !== 'merchantHashedReq')
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  const merchantHashedReq = crypto.createHmac('sha256', hashKey).update(hashString).digest('hex');
  const params = new URLSearchParams({ ...values, merchantHashedReq, merchantPaymentMethod: accountNum, plan });

  return NextResponse.redirect(`${endpoint}?${params.toString()}`, 303);
}
