# Student Flow Test Cases

## STF-001 Menu loads successfully
Expected:
- Food items shown
- No broken UI

## STF-002 Add single item to cart
Expected:
- Cart updated correctly

## STF-003 Add multiple different items to cart
Expected:
- All items visible in cart
- Quantities correct

## STF-004 Increase quantity from cart
Expected:
- Quantity increases
- Total updates

## STF-005 Decrease quantity from cart
Expected:
- Quantity decreases
- Total updates

## STF-006 Remove item from cart
Expected:
- Item removed
- Total updates

## STF-007 Place order with valid cart
Expected:
- Order created
- Cart cleared if intended
- Student redirected or shown success

## STF-008 Place order with empty cart
Expected:
- Order blocked
- User sees proper message

## STF-009 View own orders
Expected:
- Only logged-in student orders shown

## STF-010 Student cannot view another student’s orders
Expected:
- Access denied
- No other student's data exposed

## STF-011 Cancel order when status is Pending
Expected:
- Cancel allowed
- Status changes to Cancelled

## STF-012 Cancel order when status is Preparing
Expected:
- Cancel allowed if your rule allows it

## STF-013 Cancel order when status is Completed
Expected:
- Cancel blocked

## STF-014 Student cancels same order twice
Expected:
- Second cancel blocked
- No crash

## STF-015 Order history after refresh
Expected:
- Orders still visible correctly

## STF-016 Place order with unavailable food
Expected:
- Order blocked
- Proper error shown

## STF-017 Place order with preparing food
Expected:
- Order placed if allowed
- Ready time logic works