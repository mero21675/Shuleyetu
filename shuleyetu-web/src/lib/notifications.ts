/**
 * SMS/WhatsApp Notification Service
 * Integrates with Africa's Talking API for SMS and WhatsApp notifications
 */

export interface NotificationPayload {
  phoneNumber: string;
  message: string;
  type: 'sms' | 'whatsapp';
}

export interface OrderNotification {
  orderId: string;
  customerPhone: string;
  customerName: string;
  status: 'created' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderTotal?: number;
}

export interface VendorNotification {
  vendorPhone: string;
  vendorName: string;
  event: 'new_order' | 'order_update' | 'low_stock' | 'payment_received';
  details: Record<string, any>;
}

class NotificationService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = process.env.AFRICAS_TALKING_API_KEY || '';
    this.apiUrl = 'https://api.sandbox.africastalking.com/version1';
  }

  /**
   * Send SMS notification
   */
  async sendSMS(payload: NotificationPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (payload.type !== 'sms') {
      return { success: false, error: 'Invalid notification type' };
    }

    try {
      const response = await fetch(`${this.apiUrl}/messaging`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'apiKey': this.apiKey,
        },
        body: new URLSearchParams({
          username: process.env.AFRICAS_TALKING_USERNAME || '',
          recipients: payload.phoneNumber,
          message: payload.message,
        }).toString(),
      });

      const data = await response.json();

      if (data.SMSMessageData?.Recipients?.[0]?.statusCode === 0) {
        return {
          success: true,
          messageId: data.SMSMessageData.Recipients[0].messageId,
        };
      }

      return {
        success: false,
        error: data.SMSMessageData?.Recipients?.[0]?.status || 'Failed to send SMS',
      };
    } catch (error) {
      console.error('SMS notification error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Send WhatsApp notification
   */
  async sendWhatsApp(payload: NotificationPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (payload.type !== 'whatsapp') {
      return { success: false, error: 'Invalid notification type' };
    }

    try {
      const response = await fetch(`${this.apiUrl}/messaging`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'apiKey': this.apiKey,
        },
        body: new URLSearchParams({
          username: process.env.AFRICAS_TALKING_USERNAME || '',
          recipients: payload.phoneNumber,
          message: payload.message,
          channel: 'messaging',
          mediaUrl: '', // Optional media URL
        }).toString(),
      });

      const data = await response.json();

      if (data.SMSMessageData?.Recipients?.[0]?.statusCode === 0) {
        return {
          success: true,
          messageId: data.SMSMessageData.Recipients[0].messageId,
        };
      }

      return {
        success: false,
        error: data.SMSMessageData?.Recipients?.[0]?.status || 'Failed to send WhatsApp message',
      };
    } catch (error) {
      console.error('WhatsApp notification error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Send order notification to customer
   */
  async notifyOrderStatus(notification: OrderNotification): Promise<{ success: boolean; error?: string }> {
    const messages: Record<string, string> = {
      created: `Hi ${notification.customerName}, your order #${notification.orderId} has been created. Total: ${notification.orderTotal?.toLocaleString('en-TZ')} TZS. Track it at: https://shuleyetu.com/orders/track`,
      confirmed: `Your order #${notification.orderId} has been confirmed by the vendor. Prepare for delivery soon!`,
      processing: `Your order #${notification.orderId} is being processed. You'll receive it soon!`,
      shipped: `Your order #${notification.orderId} is on the way! Track your delivery.`,
      delivered: `Your order #${notification.orderId} has been delivered. Thank you for shopping with Shuleyetu!`,
      cancelled: `Your order #${notification.orderId} has been cancelled. Please contact support for details.`,
    };

    const message = messages[notification.status] || 'Order update';

    return this.sendSMS({
      phoneNumber: notification.customerPhone,
      message,
      type: 'sms',
    });
  }

  /**
   * Send vendor notification
   */
  async notifyVendor(notification: VendorNotification): Promise<{ success: boolean; error?: string }> {
    const messages: Record<string, string> = {
      new_order: `New order received! Order ID: ${notification.details.orderId}. Amount: ${notification.details.amount?.toLocaleString('en-TZ')} TZS. Check your dashboard.`,
      order_update: `Order ${notification.details.orderId} status updated to ${notification.details.status}.`,
      low_stock: `Low stock alert! ${notification.details.itemName} has only ${notification.details.quantity} units left.`,
      payment_received: `Payment received for order ${notification.details.orderId}. Amount: ${notification.details.amount?.toLocaleString('en-TZ')} TZS.`,
    };

    const message = messages[notification.event] || 'Vendor notification';

    return this.sendSMS({
      phoneNumber: notification.vendorPhone,
      message,
      type: 'sms',
    });
  }

  /**
   * Send bulk notifications
   */
  async sendBulk(
    phoneNumbers: string[],
    message: string,
    type: 'sms' | 'whatsapp' = 'sms'
  ): Promise<{ success: number; failed: number; errors: string[] }> {
    const results = await Promise.all(
      phoneNumbers.map(phone =>
        this[type === 'sms' ? 'sendSMS' : 'sendWhatsApp']({
          phoneNumber: phone,
          message,
          type,
        })
      )
    );

    const success = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    const errors = results.filter(r => r.error).map(r => r.error || '');

    return { success, failed, errors };
  }
}

export const notificationService = new NotificationService();
