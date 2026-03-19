# InstaBoost - Instagram Growth Services

## Current State
New project, no existing code.

## Requested Changes (Diff)

### Add
- Service catalog: 10k views (₹20), 1k likes (₹12), 10k followers (₹599), 1k followers (₹28), 100 comments (₹50), Repost (free)
- Balance system: user wallet balance shown on dashboard
- Add funds via UPI: show QR code (IMG_1629-1.jpeg), UPI ID adityahere777@fam, user enters UTR after payment
- Admin confirms payment (manual approval) within 5 min, balance gets added
- Order flow: user selects service, enters Instagram profile/post link, confirms order, balance deducted
- Order history page
- Admin panel: view pending UTR submissions, approve/reject, manage orders

### Modify
N/A

### Remove
N/A

## Implementation Plan
- Backend: user accounts, wallet balance, services list, fund requests (UTR submissions), orders
- Admin role can approve fund requests and view all orders
- Frontend: landing/services page, dashboard with balance, add funds flow, order placement, order history, admin panel
