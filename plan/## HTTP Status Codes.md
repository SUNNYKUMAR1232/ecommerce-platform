## HTTP Status Codes

Use standard HTTP status codes consistently across all microservices.

| Status Code | Name                   | When to Use                                           | Example                                              |
| ----------- | ---------------------- | ----------------------------------------------------- | ---------------------------------------------------- |
| **200**     | OK                     | Request completed successfully                        | Get products, update profile                         |
| **201**     | Created                | Resource created successfully                         | Create order, add product                            |
| **202**     | Accepted               | Request accepted for asynchronous processing          | Generate report, send email, start refund workflow   |
| **204**     | No Content             | Request successful with no response body              | Delete cart item, remove address                     |
| **304**     | Not Modified           | Client cache is still valid                           | Conditional GET using `ETag` or `If-None-Match`      |
| **400**     | Bad Request            | Invalid request format or missing required parameters | Invalid JSON, missing `productId`                    |
| **401**     | Unauthorized           | Authentication required or invalid JWT                | Missing/expired access token                         |
| **403**     | Forbidden              | User is authenticated but lacks permission            | Customer attempting to access an admin endpoint      |
| **404**     | Not Found              | Resource does not exist                               | Product or order not found                           |
| **405**     | Method Not Allowed     | HTTP method not supported                             | `DELETE` on a read-only endpoint                     |
| **409**     | Conflict               | Business conflict or duplicate resource               | Duplicate email, insufficient stock, duplicate order |
| **410**     | Gone                   | Resource permanently removed                          | Deleted product no longer available                  |
| **412**     | Precondition Failed    | Conditional request failed                            | Version or `ETag` mismatch                           |
| **415**     | Unsupported Media Type | Unsupported request content type                      | Sending XML instead of JSON                          |
| **422**     | Unprocessable Entity   | Validation or business rule failed                    | Quantity exceeds stock, invalid coupon               |
| **429**     | Too Many Requests      | Rate limit exceeded                                   | Too many OTP requests or API calls                   |
| **500**     | Internal Server Error  | Unexpected server-side error                          | Unhandled exception                                  |
| **502**     | Bad Gateway            | Upstream dependency returned an invalid response      | Payment gateway failure                              |
| **503**     | Service Unavailable    | Service temporarily unavailable                       | Maintenance or overloaded service                    |
| **504**     | Gateway Timeout        | Upstream service timed out                            | Payment or shipping provider timeout                 |

---

## Recommended Usage by Service

| Service           | Common Status Codes                                                         |
| ----------------- | --------------------------------------------------------------------------- |
| Auth Service      | 200, 201, 400, 401, 403, 409, 429                                           |
| User Service      | 200, 201, 204, 400, 401, 403, 404, 422                                      |
| Product Service   | 200, 201, 204, 400, 404, 409, 422                                           |
| Cart Service      | 200, 201, 204, 400, 401, 404                                                |
| Inventory Service | 200, 400, 404, 409, 422                                                     |
| Order Service     | 200, 201, 202, 400, 401, 404, 409, 422                                      |
| Payment Service   | 200, 201, 202, 400, 401, 402* (avoid unless meaningful), 409, 422, 502, 504 |
| Shipping Service  | 200, 201, 202, 404, 409, 503                                                |
| Review Service    | 200, 201, 204, 400, 401, 403, 404, 422                                      |
| Admin Service     | 200, 201, 204, 401, 403, 404                                                |

> **Note:** Although HTTP defines **402 Payment Required**, it is rarely used in public APIs. Most payment failures should return **422 Unprocessable Entity** (business failure), **409 Conflict** (duplicate payment), or **502/504** (payment provider issues), depending on the cause.

---

## Example Responses

### 200 OK

```http
HTTP/1.1 200 OK
```

```json
{
  "success": true,
  "data": {
    "id": "P001",
    "name": "iPhone 16"
  }
}
```

---

### 201 Created

```http
HTTP/1.1 201 Created
Location: /api/v1/orders/ORD123
```

```json
{
  "success": true,
  "message": "Order created successfully.",
  "data": {
    "orderId": "ORD123"
  }
}
```

---

### 204 No Content

```http
HTTP/1.1 204 No Content
```

No response body.

---

### 400 Bad Request

```json
{
  "success": false,
  "message": "Invalid request.",
  "errors": [
    {
      "field": "price",
      "message": "Price must be greater than zero."
    }
  ]
}
```

---

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Authentication required."
}
```

---

### 403 Forbidden

```json
{
  "success": false,
  "message": "You do not have permission to perform this action."
}
```

---

### 404 Not Found

```json
{
  "success": false,
  "message": "Product not found."
}
```

---

### 409 Conflict

```json
{
  "success": false,
  "message": "Insufficient inventory to fulfill the order."
}
```

---

### 422 Unprocessable Entity

```json
{
  "success": false,
  "message": "Coupon has expired."
}
```

---

### 429 Too Many Requests

```json
{
  "success": false,
  "message": "Too many requests. Please try again later."
}
```

---

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "An unexpected error occurred."
}
```

## Best Practices

* Return the **most specific status code** that accurately describes the outcome.
* Keep error response bodies consistent across all services.
* Include a **request ID** or **correlation ID** in responses for easier tracing.
* Avoid exposing internal exception messages or stack traces to clients.
* Reserve **5xx** responses for server or dependency failures, not client validation or business rule errors.
