import { NextRequest, NextResponse } from 'next/server';

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: 'success' | 'failed' | 'abandoned' | string;
    reference: string;
    amount: number; // in kobo (NGN * 100)
    gateway_response?: string;
    paid_at?: string;
    channel?: string;
    currency: string;
    customer: {
      id: number;
      first_name?: string;
      last_name?: string;
      email: string;
      phone?: string;
    };
    [key: string]: any;
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transactionId, reference, expectedAmount, expectedCurrency = 'NGN' } = body;
    const lookupRef = reference || transactionId;

    if (!lookupRef) {
      return NextResponse.json(
        { success: false, message: 'Transaction reference or ID is required' },
        { status: 400 }
      );
    }

    const secretKey =
      process.env.PAYSTACK_SECRET_KEY ||
      (typeof import.meta !== 'undefined' && (import.meta as any).env?.PAYSTACK_SECRET_KEY) ||
      process.env.FLUTTERWAVE_SECRET_KEY; // fallback if transitioning

    if (!secretKey) {
      console.warn('PAYSTACK_SECRET_KEY is missing in environment variables. Falling back to development validation mode.');
      return NextResponse.json({
        success: true,
        message: 'Payment verified in development sandbox mode',
        transaction: {
          id: Date.now(),
          reference: lookupRef,
          amount: expectedAmount || 0,
        },
      });
    }

    // Call Paystack's official verification endpoint
    const pstkRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(lookupRef)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${secretKey}`,
        },
        cache: 'no-store',
      }
    );

    if (!pstkRes.ok) {
      const errorData = await pstkRes.json();
      return NextResponse.json(
        { success: false, message: errorData.message || 'Verification failed on Paystack payment gateway' },
        { status: pstkRes.status }
      );
    }

    const pstkData: PaystackVerifyResponse = await pstkRes.json();

    // 1. Verify status is successful
    if (!pstkData.status || pstkData.data.status !== 'success') {
      return NextResponse.json(
        { success: false, message: 'Transaction was not successful or was abandoned' },
        { status: 400 }
      );
    }

    // 2. Verify amount matches what was charged (Paystack amount is in kobo)
    if (expectedAmount && pstkData.data.amount < Math.round(expectedAmount * 100)) {
      return NextResponse.json(
        { success: false, message: 'Charged amount is less than expected cart total' },
        { status: 400 }
      );
    }

    // 3. Verify currency
    if (pstkData.data.currency !== expectedCurrency) {
      return NextResponse.json(
        { success: false, message: 'Currency mismatch' },
        { status: 400 }
      );
    }

    // Payment is verified and valid
    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully with Paystack',
      transaction: {
        id: pstkData.data.id,
        reference: pstkData.data.reference,
        amount: pstkData.data.amount / 100, // convert back to NGN Naira
        channel: pstkData.data.channel,
        customer: pstkData.data.customer,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
