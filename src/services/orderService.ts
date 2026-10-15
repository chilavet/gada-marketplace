import { apiClient } from '@/lib/apiClient';
import { withMockFallback } from '@/lib/mockAdapter';
import {
  CreateOrderPayload,
  Order,
  InitializePaymentResponse,
  ApiResponse,
} from '@/types/marketplace';

export const orderService = {
  // Create order draft from checkout payload
  async createOrder(payload: CreateOrderPayload): Promise<ApiResponse<Order>> {
    return withMockFallback(async () => {
      const response = await apiClient.post<ApiResponse<Order>>('/orders', payload);
      return response.data;
    }, {
      success: true,
      data: {
        id: 'ord_mock_9921',
        orderNumber: 'ORD-2026-9921',
        userId: 'usr_01',
        status: 'order_placed',
        subOrders: [],
        delivery: {
          shippingAddress: {
            id: 'addr_01',
            street: '12 Admiralty Way',
            city: 'Lekki',
            state: 'Lagos',
            country: 'Nigeria',
          },
          recipientName: payload.recipientName,
          recipientPhone: payload.recipientPhone,
          deliveryFee: payload.deliveryZoneFee || 1500,
        },
        pricing: {
          subtotal: 45000,
          totalDeliveryFee: payload.deliveryZoneFee || 1500,
          serviceFee: 500,
          discount: 0,
          grandTotal: 45000 + (payload.deliveryZoneFee || 1500),
          currency: 'NGN',
        },
        payment: {
          transactionRef: 'trx_mock_ref_123',
          method: payload.paymentMethod,
          status: 'pending',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  },

  // Initialize payment session (e.g., Flutterwave inline URL)
  async initializePayment(orderId: string): Promise<ApiResponse<InitializePaymentResponse>> {
    return withMockFallback(async () => {
      const response = await apiClient.post<ApiResponse<InitializePaymentResponse>>(
        `/orders/${orderId}/initialize-payment`
      );
      return response.data;
    }, {
      success: true,
      data: {
        authorizationUrl: 'https://checkout.flutterwave.com/v3/hosted/pay/sample_reference',
        reference: `trx_${Date.now()}`,
      },
    });
  },

  // Verify Flutterwave transaction
  async verifyPayment(payload: {
    transactionId: number | string;
    expectedAmount?: number;
    expectedCurrency?: string;
  }): Promise<ApiResponse<{ id: number; txRef: string; amount: number; customer: any }>> {
    return withMockFallback(async () => {
      const response = await apiClient.post<ApiResponse<any>>(
        '/payments/verify',
        payload
      );
      return response.data;
    }, {
      success: true,
      data: {
        id: Number(payload.transactionId) || 123456,
        txRef: `tx_${payload.transactionId}`,
        amount: payload.expectedAmount || 0,
        customer: {
          id: 1,
          name: 'Customer',
          email: 'customer@example.com',
          phone_number: '08012345678',
        },
      },
    });
  },

  // Track status updates for post-checkout timeline
  async getOrderStatus(orderId: string): Promise<ApiResponse<Order>> {
    return withMockFallback(async () => {
      const response = await apiClient.get<ApiResponse<Order>>(`/orders/${orderId}`);
      return response.data;
    }, {
      success: true,
      data: {
        id: orderId,
        orderNumber: orderId.startsWith('ORD-') ? orderId : `ORD-${orderId}`,
        userId: 'usr_01',
        status: 'out_for_delivery',
        subOrders: [],
        delivery: {
          shippingAddress: {
            id: 'addr_01',
            street: '14 Ring Road',
            city: 'Ibadan',
            state: 'Oyo State',
            country: 'Nigeria',
          },
          recipientName: 'Customer',
          recipientPhone: '+234 800 000 0000',
          deliveryFee: 1500,
          estimatedTime: '15 mins',
        },
        rider: {
          id: 'rider_01',
          name: 'Babatunde Ogunlesi',
          phone: '+234 812 893 4921',
          vehiclePlateNumber: 'IBD-492-OYO',
          vehicleType: 'motorcycle',
        },
        pricing: {
          subtotal: 12000,
          totalDeliveryFee: 1500,
          serviceFee: 300,
          discount: 0,
          grandTotal: 13800,
          currency: 'NGN',
        },
        payment: {
          transactionRef: `trx_${Date.now()}`,
          method: 'flutterwave',
          status: 'success',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  },
};
