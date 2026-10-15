import { NextRequest, NextResponse } from 'next/server';

interface FlutterwaveVerifyResponse {
  status: string;
  message: string;
  data: {
    id: number;
    tx_ref: string;
    flw_ref: string;
    amount: number;
    currency: string;
    charged_amount: number;
    status: 'successful' | 'failed' | 'pending';
    payment_type: string;
    customer: {
      id: number;
      name: string;
      email: string;
      phone_number: string;
    };
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transactionId, expectedAmount, expectedCurrency = 'NGN' } = body;

    if (!transactionId) {
      return NextResponse.json(
        { success: false, message: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    const secretKey =
      process.env.FLUTTERWAVE_SECRET_KEY ||
      (typeof import.meta !== 'undefined' && (import.meta as any).env?.FLUTTERWAVE_SECRET_KEY);

    if (!secretKey) {
      console.error('FLUTTERWAVE_SECRET_KEY is missing in environment variables');
      return NextResponse.json(
        { success: false, message: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Call Flutterwave's private verification endpoint
    const flwRes = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${secretKey}`,
        },
        cache: 'no-store',
      }
    );

    if (!flwRes.ok) {
      const errorData = await flwRes.json();
      return NextResponse.json(
        { success: false, message: errorData.message || 'Verification failed on payment gateway' },
        { status: flwRes.status }
      );
    }

    const flwData: FlutterwaveVerifyResponse = await flwRes.json();

    // 1. Verify status is successful
    if (flwData.status !== 'success' || flwData.data.status !== 'successful') {
      return NextResponse.json(
        { success: false, message: 'Transaction was not successful' },
        { status: 400 }
      );
    }

    // 2. Verify amount matches what was charged
    if (expectedAmount && flwData.data.amount < expectedAmount) {
      return NextResponse.json(
        { success: false, message: 'Charged amount does not match expected cart total' },
        { status: 400 }
      );
    }

    // 3. Verify currency
    if (flwData.data.currency !== expectedCurrency) {
      return NextResponse.json(
        { success: false, message: 'Currency mismatch' },
        { status: 400 }
      );
    }

    // Payment is verified and valid
    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      transaction: {
        id: flwData.data.id,
        txRef: flwData.data.tx_ref,
        amount: flwData.data.amount,
        customer: flwData.data.customer,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
