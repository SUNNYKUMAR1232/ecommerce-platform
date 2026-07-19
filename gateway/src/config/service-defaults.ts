import type { ServiceName } from '@/types/intex.js';

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

export function getStaticServiceUrl(service: ServiceName) {
  const envKey = `${service.toUpperCase().replace(/-/g, '_')}_URL`;

  return process.env[envKey] ?? `http://${service}:${serviceDefaults[service]}`;
}
