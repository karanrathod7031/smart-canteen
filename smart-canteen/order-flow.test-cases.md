# Order Flow Test Cases

## ORD-001 Order total calculation
Expected:
- Sum = price × quantity for all items

## ORD-002 Order item snapshot
Expected:
- Order stores item name, price, quantity correctly
- Later menu edits should not break old order display

## ORD-003 Multiple orders from same student
Expected:
- All saved correctly
- Sorted properly

## ORD-004 Multiple students placing orders simultaneously
Expected:
- All orders visible
- No overwritten data

## ORD-005 Invalid foodId in order request
Expected:
- API rejects request

## ORD-006 Invalid quantity in order request
Expected:
- API rejects request

## ORD-007 Empty items array
Expected:
- API rejects request

## ORD-008 Ready time field behavior
Expected:
- Set when food is preparing
- Null otherwise

## ORD-009 Student name stored correctly in order
Expected:
- Admin sees correct student name

## ORD-010 Broken order should not crash page
Expected:
- Fallback UI like Unknown / No items