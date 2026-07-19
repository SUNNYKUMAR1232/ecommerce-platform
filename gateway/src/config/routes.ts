import { RouteDefinition } from '@/types/intex.js';

export const routeDefinitions: RouteDefinition[] = [
  { path: '/api/v1/auth', service: 'auth-service', requiresAuth: false },
  { path: '/api/v1/users', service: 'user-service', requiresAuth: true },
  { path: '/api/v1/products', service: 'product-service', requiresAuth: false },
  { path: '/api/v1/inventory', service: 'inventory-service', requiresAuth: true },
  { path: '/api/v1/cart', service: 'cart-service', requiresAuth: true },
  { path: '/api/v1/orders', service: 'order-service', requiresAuth: true },
  { path: '/api/v1/payments', service: 'payment-service', requiresAuth: true },
  { path: '/api/v1/shipping', service: 'shipping-service', requiresAuth: true },
  { path: '/api/v1/reviews', service: 'review-service', requiresAuth: false },
  { path: '/api/v1/notifications', service: 'notification-service', requiresAuth: true },
  { path: '/api/v1/search', service: 'search-service', requiresAuth: false },
  { path: '/api/v1/recommendations', service: 'recommendation-service', requiresAuth: true },
  { path: '/api/v1/analytics', service: 'analytics-service', requiresAuth: true },
];
