export type ServiceName =
  | 'auth-service'
  | 'user-service'
  | 'order-service'
  | 'payment-service'
  | 'product-service'
  | 'inventory-service'
  | 'cart-service'
  | 'shipping-service'
  | 'review-service'
  | 'notification-service'
  | 'search-service'
  | 'recommendation-service'
  | 'analytics-service';

export interface ServiceInstance {
  address: string;
  port: number;
}

export interface JwtPayload {
  sub?: string;
  userId?: string;
  roles?: string[];
}

export interface RouteDefinition {
  path: string;
  service: ServiceName;
  requiresAuth: boolean;
}
