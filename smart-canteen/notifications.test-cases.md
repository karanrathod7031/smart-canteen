# Notification Test Cases

## NOT-001 New order toast appears
Steps:
1. Keep admin orders page open
2. Student places order
Expected:
- Toast appears on admin side

## NOT-002 New order sound plays
Expected:
- Sound plays once

## NOT-003 Silent mode ON
Expected:
- Toast appears
- No sound

## NOT-004 Silent mode OFF again
Expected:
- Sound resumes

## NOT-005 Silent mode persists
Expected:
- Refresh page
- Previous silent mode state remains if intended

## NOT-006 Notification on order cancel
Expected:
- Cancel toast appears if implemented

## NOT-007 Duplicate notification prevention
Expected:
- Single event should not create duplicate toasts

## NOT-008 Notification when multiple orders arrive quickly
Expected:
- All relevant toasts appear
- UI does not break

## NOT-009 Missing sound file behavior
Expected:
- Toast still works
- App does not crash

## NOT-010 Browser autoplay restriction
Expected:
- App handles blocked audio gracefully