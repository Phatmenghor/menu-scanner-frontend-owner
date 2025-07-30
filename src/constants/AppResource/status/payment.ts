export const paymentMethodOptions = [
  { value: "CASH", label: "Cash Payment" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "MOBILE_PAYMENT", label: "Mobile Payment (ABA/Wing/Pi Pay)" },
  { value: "ONLINE", label: "Online Payment" },
];

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}
