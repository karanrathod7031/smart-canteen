# Session and Security Test Cases

## SEC-001 Access admin orders without token
Expected:
- 401/redirect to login

## SEC-002 Access admin analytics without token
Expected:
- 401/redirect

## SEC-003 Student token used on admin route
Expected:
- 403 or denied access

## SEC-004 Admin token used on student-only route
Expected:
- Access behavior should follow your design, preferably blocked if not intended

## SEC-005 Student cannot cancel another student’s order
Expected:
- 403

## SEC-006 Student cannot fetch another student’s orders
Expected:
- 403 or route not allowed

## SEC-007 Expired token
Expected:
- Session invalid
- Redirect/login required

## SEC-008 Tampered token
Expected:
- Unauthorized

## SEC-009 Direct API call from Postman without token
Expected:
- Unauthorized for protected routes

## SEC-010 Sensitive info not stored in frontend code
Expected:
- No secrets in client source