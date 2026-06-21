# ProNPS MVP PRD

## 1. Product Summary

ProNPS is a lightweight B2B SaaS product for small and medium service businesses to collect private customer feedback, measure loyalty, and react quickly to negative experiences.

The first MVP focuses on a simple company registration flow, a public feedback page with animated 1-5 star rating, a company dashboard with loyalty metrics, and a configurable thank-you page with a bonus.

## 2. Target Users

### Primary Customer

Small and medium service businesses that interact directly with customers and want fast private feedback after a service experience.

Examples:

- clinics
- salons
- restaurants
- car service centers
- education centers
- local service providers

### End User

The customer of the business. They do not create an account. They open a review link or QR code, leave a rating, add a comment, optionally leave contact details, and submit.

## 3. Core MVP Value

The MVP is focused on:

- private feedback collection
- 1-5 star rating experience
- NPS-like loyalty metrics based on a 5-star scale
- negative feedback alerts
- simple company dashboard
- QR/link distribution
- thank-you page with a bonus

Public review generation, Google Reviews integration, CRM workflows, AI tagging, multi-location support, and payments are out of scope for the first MVP.

## 4. Rating Model

The product uses a 1-5 star scale.

- `1` = worst experience
- `5` = best experience

The dashboard calculates an NPS-like loyalty metric from this scale.

### Loyalty Score Formula

`Loyalty Score = % of ratings 5 - % of ratings 1-3`

Groups:

- `5` = promoters / positive
- `4` = passive / nearly loyal
- `1-3` = detractors / negative or risky

Range:

- `-100` to `100`

The product should call this metric "Loyalty Score" or "Індекс лояльності", not classic NPS, because classic NPS uses a 0-10 scale.

## 5. Public Feedback Flow

### Route

`/r/{companySlug}`

Example:

`/r/nova-clinic`

### UX

The public feedback page must be:

- mobile-first
- minimal
- fast
- modern B2B/SaaS style
- light theme only
- visually focused on the rating action

Page content:

- company logo or initials
- company name
- language switcher: UA / EN
- large animated 1-5 star rating
- dynamic question after rating selection
- required text comment field
- optional email or phone field
- submit button
- compact privacy consent text with link to `/privacy`

No separate text should explain that the review is private.

### Dynamic Questions

For ratings `4-5`:

Ukrainian:

`Що вам сподобалося у нашій компанії, а що варто покращити?`

English:

`What did you like about our company, and what should we improve?`

For ratings `1-3`:

Ukrainian:

`Що вам не сподобалося при взаємодії з нашою компанією? Що нам потрібно змінити, щоб ви оцінили нас на 5?`

English:

`What did you dislike about your interaction with our company? What should we change for you to rate us 5?`

### Submission Rules

Required:

- rating
- comment

Optional:

- email or phone contact

Comment validation:

- minimum: 30 characters
- maximum: 1000 characters

Anti-spam:

- hidden honeypot field
- rate limit by IP/browser/company link
- store technical metadata for abuse diagnostics
- no customer account
- no SMS or email verification for customers

### Submit Flow

1. Frontend validates rating and comment length.
2. Backend validates rating, comment, contact, honeypot, and rate limit.
3. Backend creates a `Review` record.
4. If rating is `1-3` and the company owner's email is verified, send a negative review alert via Resend.
5. Redirect the customer to `/r/{companySlug}/thanks`.

## 6. Thank-You Page

### Route

`/r/{companySlug}/thanks`

### Behavior

The thank-you page appears after any submitted review, regardless of rating.

This avoids incentivizing only positive ratings and keeps the experience trustworthy.

### Company Settings

The company owner can configure:

- thank-you title
- thank-you message
- bonus enabled/disabled
- bonus description
- promo code or bonus instructions
- button label
- button URL

The MVP should not support different bonuses per rating, coupon limits, expiration rules, or automatic promo-code validation.

## 7. Company Registration

### Route

`/register`

### Fields

Required:

- company name
- company category
- owner email
- password

Optional:

- company website
- company logo

### Logo Rules

Allowed formats:

- PNG
- JPG
- WEBP

Maximum size:

- 2 MB

Not allowed in MVP:

- SVG

If no logo is uploaded, the UI should show company initials.

### Registration Result

After registration:

- create user owner account
- create company
- generate unique company slug
- generate public review link `/r/{companySlug}`
- create default thank-you settings
- send email verification message
- allow immediate access to dashboard

Email verification does not block review collection.

## 8. Authentication

### Owner Auth

The company owner uses email and password.

Required flows:

- register
- login
- logout
- email verification
- forgot password
- reset password

### Email Verification

Email verification is real in the MVP.

Flow:

1. Send verification email after registration.
2. User opens `/verify-email?token=...`.
3. Mark email as verified.
4. Remove verification banner from dashboard.
5. Enable negative review email alerts.

If email is not verified:

- review collection still works
- dashboard shows a reminder banner
- negative review email alerts are not sent, or the UI clearly warns that alerts require verification

### Password Reset

Routes:

- `/forgot-password`
- `/reset-password?token=...`

Rules:

- token is single-use
- token expires
- password is hashed after reset
- old sessions should be invalidated if practical in MVP

## 9. Company Dashboard

### Routes

- `/dashboard`
- `/dashboard/reviews`
- `/dashboard/settings`

The dashboard should be responsive, with priority on desktop/tablet. The public feedback form is mobile-first.

### Dashboard Overview

The first screen should show:

- average rating
- total reviews
- percentage of positive reviews: rating `5`
- percentage of negative/risky reviews: ratings `1-3`
- number of negative reviews in the last 7 days
- Loyalty Score
- simple 30-day chart for rating trend or review volume
- public review URL
- QR code
- copy link button
- download QR button
- email verification banner when needed

### Reviews Page

The reviews page should show:

- review rating
- comment
- optional contact
- source
- date
- active/archived status

Filters:

- all
- ratings `1-3`
- rating `4`
- rating `5`
- active
- archived

Actions:

- archive review
- export CSV

Reviews are not deleted in the MVP. They can only be archived.

Metrics should be calculated from all reviews, not manipulated by archiving.

### Settings Page

Settings include:

- company name
- category
- website
- logo upload/change
- thank-you page settings
- bonus settings
- notification preference for negative review alerts

## 10. Admin Area

### Route

`/admin`

The internal admin area is for the product owner.

Required capabilities:

- list companies
- view company name
- view company owner email
- view review count
- view registration date
- view email verification status
- view company status
- deactivate company

Company status:

- `active`
- `disabled`

When a company is disabled:

- public review page does not accept new reviews
- customer sees a neutral "page temporarily unavailable" state
- existing company data is not deleted
- company dashboard can show a disabled-account banner

Admin should not edit company reviews in the MVP.

## 11. Public and App Routes

Required routes:

- `/` - simple entry page
- `/register` - company registration
- `/login` - owner login
- `/forgot-password` - password reset request
- `/reset-password` - password reset form
- `/verify-email` - email verification
- `/dashboard` - company overview
- `/dashboard/reviews` - reviews list and CSV export
- `/dashboard/settings` - company and thank-you settings
- `/r/{slug}` - public feedback form
- `/r/{slug}/thanks` - thank-you page
- `/admin` - internal admin area
- `/privacy` - privacy policy

## 12. Home Page

The home page should be a simple entry page, not a full marketing landing page.

Content:

- product name: ProNPS
- short value message
- CTA: create company
- CTA: login
- small product preview showing stars and mini metrics
- language switcher UA / EN

Suggested message:

Ukrainian:

`Збирайте приватний фідбек і вимірюйте лояльність клієнтів.`

English:

`Collect private feedback and measure customer loyalty.`

## 13. Internationalization

MVP languages:

- Ukrainian
- English

Requirements:

- visible UA/EN language switcher
- browser language can be used for initial language selection
- system questions are standard in both languages
- company does not customize review questions in MVP
- thank-you settings should support company-entered content

## 14. Data Model

### User

Fields:

- `id`
- `email`
- `passwordHash`
- `role`: `OWNER` or `ADMIN`
- `emailVerifiedAt`
- `createdAt`
- `updatedAt`

Relations:

- owns one company in MVP

### Company

Fields:

- `id`
- `ownerId`
- `name`
- `category`
- `website`
- `slug`
- `logoUrl` or `logoKey`
- `status`: `active` or `disabled`
- `plan`
- `subscriptionStatus`
- `negativeAlertEnabled`
- `createdAt`
- `updatedAt`

### Review

Fields:

- `id`
- `companyId`
- `rating`: integer 1-5
- `comment`
- `contact`
- `source`
- `status`: `active` or `archived`
- `metadata`
- `createdAt`
- `updatedAt`

Metadata may include:

- IP hash
- user agent
- locale

### ThankYouSettings

Fields:

- `id`
- `companyId`
- `title`
- `message`
- `bonusEnabled`
- `bonusText`
- `promoCode`
- `buttonLabel`
- `buttonUrl`
- `createdAt`
- `updatedAt`

### EmailVerificationToken

Fields:

- `id`
- `userId`
- `tokenHash`
- `expiresAt`
- `usedAt`
- `createdAt`

### PasswordResetToken

Fields:

- `id`
- `userId`
- `tokenHash`
- `expiresAt`
- `usedAt`
- `createdAt`

## 15. Infrastructure

Chosen stack:

- Next.js
- Prisma
- PostgreSQL
- Resend
- S3/R2-compatible storage

Deployment target:

- App: Vercel
- Database: Neon PostgreSQL
- Storage: Cloudflare R2
- Email: Resend

Architecture:

- monolithic Next.js app
- route handlers and server actions
- no separate backend service in MVP

Suggested code organization:

- `app/` for routes and UI
- `components/` for shared UI
- `lib/db` for Prisma client
- `lib/auth` for authentication helpers
- `lib/email` for Resend integration
- `lib/storage` for local and R2 adapters
- `lib/validation` for Zod schemas
- `lib/metrics` for rating calculations
- `lib/rate-limit` for submission and auth rate limiting
- `server/` or `lib/server/` for business logic

## 16. Security Baseline

MVP security requirements:

- password hashing with bcrypt or argon2
- secure session cookies: `httpOnly`, `secure`, `sameSite`
- server-side authorization and ownership checks
- admin routes restricted to `role=ADMIN`
- validation with Zod on client and server
- rate limits for login, registration, and review submission
- CSRF protection where needed
- token hashing for verification and password reset tokens
- no SVG uploads in MVP
- file type and size validation for logo uploads
- store IP only as a hash when possible

Not required in MVP:

- 2FA
- team roles
- customer authentication

## 17. Error and Empty States

Required states:

- missing company slug: page not found
- disabled company: page temporarily unavailable
- submit failure: short error and retry option
- empty dashboard: show review link, QR, and sharing guidance
- unverified email: dashboard banner and resend verification action

## 18. Email Templates

MVP transactional emails:

1. Email verification
2. Password reset
3. Negative review alert for ratings `1-3`

No marketing emails, welcome sequence, positive review alerts, or digest emails in MVP.

## 19. CSV Export

The company owner can export reviews as CSV.

Suggested columns:

- date
- rating
- comment
- contact
- source
- status

No import feature in MVP.

## 20. Local Development Seed

Production should not create demo data for new companies.

Local development should include a Prisma seed with:

- demo owner
- demo company
- thank-you settings
- realistic reviews across ratings 1-5
- enough data to test metrics, filters, and charts

## 21. Testing Scope

Minimum MVP tests:

- metric calculation tests
- review validation tests
- auth and ownership tests
- e2e smoke test:
  - register
  - login
  - open public review page
  - submit review
  - see review in dashboard

Pixel-perfect visual tests are not required in MVP.

## 22. Definition of Done

The MVP is ready when:

1. A company owner can register a company.
2. The owner receives a unique review link and QR code.
3. A customer can submit a review without creating an account.
4. Review submission requires rating and a 30-1000 character comment.
5. Optional customer contact is stored when provided.
6. Reviews are stored in PostgreSQL.
7. Negative review alert emails are sent for ratings `1-3` when owner email is verified.
8. Customer is redirected to the configured thank-you page after submission.
9. Company owner can view dashboard metrics, chart, reviews, filters, archive, and CSV export.
10. Company owner can configure thank-you page and bonus.
11. Admin can view companies and deactivate a company.
12. UA/EN language support works for the main UI.
13. Baseline security and rate limiting are implemented.
14. Minimum test suite passes.

## 23. Explicitly Out of Scope for MVP

- Google Reviews integration
- public review publishing
- AI analysis or tagging
- CRM integrations
- customer accounts
- team roles
- multi-location companies
- payments and billing
- real-time dashboard updates
- dark theme
- built-in company replies to customers
- custom review questions
- category checkboxes for feedback reasons
- advanced campaign analytics
- coupon validation
- email digests
- positive review alerts
