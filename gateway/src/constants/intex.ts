import { RouteDefinition, ServiceName } from '../types/intex.js';

const serviceDefaults: Record<ServiceName, number> = {
  'auth-service': 8081,
  'user-service': 8082,
  'product-service': 8083,
  'inventory-service': 8084,
  'cart-service': 8085,
  'order-service': 8086,
  'payment-service': 8087,
  'shipping-service': 8088,
  'review-service': 8089,
  'notification-service': 8090,
  'search-service': 8091,
  'recommendation-service': 8092,
  'analytics-service': 8093,
};

const routeDefinitions: RouteDefinition[] = [
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

export { serviceDefaults, routeDefinitions };
