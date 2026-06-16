import { PAYMENT_CARD_NUMBER } from '@env';

export const paymentCardNumber =
  PAYMENT_CARD_NUMBER?.trim() || '5375 4141 0000 0000';
