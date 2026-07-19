export type EventCategory =
  | 'user'
  | 'product'
  | 'inventory'
  | 'order'
  | 'payment'
  | 'shipping'
  | 'notification'
  | 'analytics';

export type DomainEvent<TPayload = unknown> = {
  id: string;
  category: EventCategory;
  type: string;
  occurredAt: string;
  payload: TPayload;
  correlationId: string;
  requestId: string;
};
