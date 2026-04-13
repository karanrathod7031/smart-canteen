# Authentication Test Cases

## AUTH-001 Student registration with valid data
Preconditions: None
Steps:
1. Open student register page
2. Enter valid name, email, password
3. Submit form
Expected:
- Student account created
- Redirect or login success flow starts
- Token/session saved properly

## AUTH-002 Student registration with existing email
Steps:
1. Register using already registered email
Expected:
- Error shown
- Duplicate account not created

## AUTH-003 Student login with valid credentials
Steps:
1. Open student login
2. Enter valid email/password
3. Submit
Expected:
- Login successful
- Student redirected correctly
- Session stored correctly

## AUTH-004 Student login with wrong password
Expected:
- Error shown
- Login denied

## AUTH-005 Admin login with valid credentials
Expected:
- Admin login successful
- Admin dashboard accessible

## AUTH-006 Admin login with invalid credentials
Expected:
- Error shown
- No admin session created

## AUTH-007 Student tries admin route from browser URL
Steps:
1. Login as student
2. Try opening admin page route directly
Expected:
- Access denied or redirect

## AUTH-008 Logout test
Steps:
1. Login
2. Click logout
Expected:
- Session cleared
- Protected pages inaccessible

## AUTH-009 Browser close session test
Steps:
1. Login
2. Close browser/tab
3. Reopen site
Expected:
- User logged out if using sessionStorage

## AUTH-010 Refresh page after login
Expected:
- User should remain logged in during current session