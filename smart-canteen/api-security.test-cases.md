# API Security and Validation Test Cases

## API-001 POST /orders with missing items
Expected:
- 400 response

## API-002 POST /orders with invalid quantity
Expected:
- 400 response

## API-003 POST /orders with fake foodId
Expected:
- 404 or 400

## API-004 GET /orders without admin token
Expected:
- 401

## API-005 PATCH /orders/:id/status without token
Expected:
- 401

## API-006 PATCH /orders/:id/status with student token
Expected:
- 403

## API-007 PATCH /orders/:id/status with invalid status
Expected:
- 400

## API-008 PUT /orders/:id/cancel for completed order
Expected:
- 400

## API-009 Large unexpected payload
Expected:
- API should reject or safely handle

## API-010 Script injection attempt in food name or student name
Expected:
- Stored/rendered safely without executing scripts