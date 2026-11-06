/**
 * Utilities for WhatsApp customer contact and enquiry links
 */

export const DEFAULT_WHATSAPP_NUMBER = '919845012345';
export const DEFAULT_PHONE_NUMBER = '+91 98450 12345';

export function formatWhatsAppUrl(phoneNumber: string, message: string): string {
  // Strip non-numeric characters for the WhatsApp API
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(message.trim());
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

export function getDesignEnquiryMessage(designId: string, designName: string): string {
  return `Hello Sangeetha Tailors, I am interested in Design ID: ${designId}, ${designName}. Please provide more details about stitching and pricing.`;
}

export function getGeneralEnquiryMessage(): string {
  return `Hello Sangeetha Tailors, I would like to enquire about your custom stitching and tailoring services at Domlur, Bengaluru.`;
}
