# Deployment and Production Test Cases

## DEP-001 Frontend loads on live URL
Expected:
- Site opens successfully

## DEP-002 Backend health/API reachable
Expected:
- API responds

## DEP-003 Frontend connected to production backend
Expected:
- No localhost URLs in production

## DEP-004 MongoDB Atlas connection works
Expected:
- Data loads correctly

## DEP-005 CORS configured correctly
Expected:
- Frontend can call backend
- Unauthorized origins blocked if configured

## DEP-006 Socket connection works in production
Expected:
- Real-time orders still work

## DEP-007 Notifications work in production
Expected:
- Toast works
- Sound works

## DEP-008 Environment variables configured
Expected:
- JWT secret, DB URI, frontend API URL all correct

## DEP-009 Hard refresh production routes
Expected:
- App routing still works

## DEP-010 Browser console check
Expected:
- No critical runtime errors