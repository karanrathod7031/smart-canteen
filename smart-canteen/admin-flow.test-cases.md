# Admin Flow Test Cases

## ADM-001 Admin dashboard loads
Expected:
- Dashboard visible
- No auth error

## ADM-002 Admin menu manager loads
Expected:
- Food list visible

## ADM-003 Add new food item
Expected:
- Item added successfully
- Appears in student menu if available

## ADM-004 Edit food item
Expected:
- Changes saved
- Updated value visible everywhere

## ADM-005 Delete food item
Expected:
- Item removed
- UI refreshes correctly

## ADM-006 Mark food unavailable
Expected:
- Student cannot place order for it

## ADM-007 Mark food preparing with prep time
Expected:
- Preparing state visible
- Order ready time logic works

## ADM-008 View all orders
Expected:
- All orders listed
- Latest orders visible first

## ADM-009 Expand order details
Expected:
- Items visible only when expanded

## ADM-010 Change order Pending → Preparing
Expected:
- Status updates correctly

## ADM-011 Change order Preparing → Completed
Expected:
- Status updates correctly

## ADM-012 Change cancelled order status
Expected:
- Blocked

## ADM-013 Admin refreshes page
Expected:
- Latest order state remains correct

## ADM-014 Unauthorized user opens admin APIs
Expected:
- 401 or 403 response