# System Design: Vendor Management System — Multi-Tenant SaaS

**Version:** 1.1.0
**Last updated:** 2026-06-23

## Context

The Vendor Management System (VMS) is a **multi-tenant SaaS platform** where many buyer companies (tenants) each onboard, vet, and manage their own set of vendors from a single shared platform. Every tenant's data is logically isolated inside the same database via `tenant_id` + Row-Level Security. Vendors are invited into the tenant's workspace and use a separate self-service portal to maintain their profile, submit documents, respond to purchase orders, raise invoices, and track payments.

The platform consolidates vendor onboarding, document verification, approval workflows, contract management, purchase-order tracking, invoice & payment processing, performance reviews, and reporting — replacing the email-and-spreadsheet sprawl that procurement, finance, and operations teams typically rely on.

**Tech stack baseline:**
- All micro-services: **Python FastAPI** (async, Pydantic validation, Uvicorn ASGI)
- Primary database: **Neon PostgreSQL** (serverless, DB branching, built-in PgBouncer, RLS for tenant isolation)
- Frontends: **React 18 + Vite + TypeScript + MUI v5**, two static builds
- Messaging: **RabbitMQ** (durable async events) + **Redis Pub/Sub** (real-time UI updates)
- File storage: **AWS S3** (vendor documents, contracts, invoices)
- Cache / sessions: **Redis** (Upstash serverless)
- Deployment: **Docker Compose** (dev), **Kubernetes** (prod)
- Repository strategy: **Polyrepo** — one repo per micro-service and per UI app; shared design system / SDK / API contracts ship as versioned published packages (`@vms/ui`, `@vms/sdk` on npm; `vms-contracts` on private PyPI). Each repo owns its lifecycle and CI pipeline.

---

## 1. High-Level Architecture Overview

```
[Buyer Admin Browser]        [Vendor User Browser]
         │                            │
         ▼                            ▼
    [CDN — CloudFront / Cloudflare]
    Static assets · signed S3 document links
         │
         ▼
    [Nginx Reverse Proxy Layer]
    TLS 1.3 · Rate limiting · WAF rules · DDoS protection
         │
    ┌────┴─────────────────────┐
    ▼                          ▼
[admin.vms.io]            [vendor.vms.io]
 React App (Buyer)        React App (Vendor)
         │                          │
         └────────────┬─────────────┘
                      ▼
           [API Gateway — Kong]
    JWT auth · tenant claim · routing · rate limit · metrics
                      │
    ┌─────┬───────┬───────┬──────────┬──────────┬──────────┬───────────┐
    ▼     ▼       ▼       ▼          ▼          ▼          ▼           ▼
 [Auth][Tenant][Vendor][Document][Contract][Purchase][Invoice][Payment]
 :3021 :3022  :3023   :3024      :3025     Order:3026 :3027    :3028
    ┌───────┬────────────┬───────────────┬─────────────┐
    ▼       ▼            ▼               ▼             ▼
[Performance][Notification][Reporting][Audit]      (all internal-only,
 :3029        :3030         :3031      :3032          no public ports)
                      │
            [RabbitMQ — Async event bus]
            [Redis Pub/Sub — Real-time UI]
                      │
         [Databases / Storage / Infrastructure]
    Neon PostgreSQL (tenant-isolated) · S3 · Redis
```

**Layer responsibilities:**
1. **Presentation Layer** — Two React SPAs (Buyer Admin portal, Vendor portal). Static Vite builds served by Nginx; no SSR.
2. **Application Layer** — 12 internal FastAPI micro-services behind Kong. Frontends never reach a service directly.
3. **Data Layer** — Neon PostgreSQL for all relational entities, S3 for files, Redis for cache/sessions.
4. **Integration Layer** — Email/SMS gateway (Notification Service), optional document-verification provider, optional ERP/accounting sync (future).

---

## 2. Frontend — Two React Apps

**Deployment:**

| App | Path | Subdomain | Serves | Build |
|---|---|---|---|---|
| `vms-admin-portal` (repo) | Buyer company workspace | `admin.vms.io` | Buyer Admin + Procurement + Finance + Ops panels | React 18 + Vite static build |
| `vms-vendor-portal` (repo) | Vendor self-service | `vendor.vms.io` | Vendor user dashboard + submissions | React 18 + Vite static build |

**Tech Stack (both apps):** React 18, Vite, TypeScript, MUI v5, Zustand (client state), React Query (server state), React Router v6, Recharts (dashboards), `react-hook-form` + Zod (forms & validation).

**Strict separation of concerns:**
- Both apps talk **only** to Kong over HTTPS — never to a service directly.
- All services are internal-only (no public ports).
- Tenant identity comes from the JWT claim (`tenant_id` + `role`); the Admin portal renders Buyer modules, the Vendor portal renders Vendor modules.
- Vendor users authenticate independently and carry a `vendor_id` claim scoped to one tenant's vendor record.

**Auth flow:**
1. Login (Kong → Auth Service) validates credentials.
2. JWT issued with `tenant_id`, `role`, `user_id`, and (for vendor users) `vendor_id`.
3. React app renders the correct layout based on `role`.
4. Every API request carries the JWT; Kong + RLS enforce tenant isolation.

**Design principles:**
- Desktop-first responsive (enterprise users are on laptops), graceful down to tablet.
- Keyboard-navigable data tables, sortable columns, server-side pagination.
- Skeleton loaders for >300 ms responses; empty states with a primary action.
- i18n-ready (react-i18next), English at launch.
- No inline styles — MUI `sx` / `styled()` only.

### 2.1 Buyer Admin Portal — `admin.vms.io`

| Route | Page | Roles | Key Features |
|---|---|---|---|
| `/login` | Login | Public | Email + password, optional MFA |
| `/dashboard` | Dashboard | Admin, Procurement, Finance, Ops | KPI cards, charts, action queue |
| `/vendors` | Vendors | Admin, Procurement | Filterable table, status badges, bulk actions |
| `/vendors/:id` | Vendor Details | Admin, Procurement | Profile, documents, contracts, POs, invoices, performance |
| `/approvals` | Approval Queue | Admin, Procurement | Pending vendor/document/contract approvals |
| `/contracts` | Contracts | Admin, Finance | List, renewal alerts, e-sign status |
| `/purchase-orders` | Purchase Orders | Admin, Procurement | Create/track POs, link to vendor & contract |
| `/invoices` | Invoices | Finance | Aging buckets, approve/reject, payment status |
| `/payments` | Payments | Finance | Payment history, schedule payments |
| `/performance` | Performance Reviews | Admin, Procurement | Scorecards, trend charts |
| `/reports` | Reports | Admin, Finance | Export PDF/CSV, saved views |
| `/users` | User Management | Admin | RBAC, invite/deactivate internal users |
| `/settings` | Settings | Admin | Tenant profile, categories, approval rules |

### 2.2 Vendor Portal — `vendor.vms.io`

| Route | Page | Key Features |
|---|---|---|
| `/login` | Login | Vendor user credentials |
| `/onboarding` | Onboarding Wizard | Multi-step registration with progress indicator |
| `/dashboard` | Dashboard | Registration status, pending tasks, open POs, invoice summary |
| `/profile` | Company Profile | Edit company, contact, tax, banking details |
| `/documents` | Documents | Upload/replace PAN, GST, registration, insurance; expiry alerts |
| `/contracts` | Contracts | View active contracts, e-sign, renewal notices |
| `/purchase-orders` | Purchase Orders | Acknowledge/reject POs, view line items |
| `/invoices` | Invoices | Raise invoices against POs, track payment status |
| `/payments` | Payments | View remittance history |
| `/support` | Support | Messages to the buyer team |

---

## 3. Nginx Layer — Security & Reverse Proxy

Nginx terminates TLS, serves the static React builds, and fronts Kong.

```nginx
# Rate-limit zones (buyer + vendor traffic isolated)
limit_req_zone $binary_remote_addr zone=login:10m  rate=5r/m;   # 5 logins / min / IP
limit_req_zone $binary_remote_addr zone=upload:10m rate=10r/m;  # doc uploads
limit_req_zone $binary_remote_addr zone=api:10m    rate=60r/m;  # general API

server {
    listen 443 ssl http2;
    server_name admin.vms.io vendor.vms.io;

    ssl_certificate     /etc/ssl/vms.crt;
    ssl_certificate_key /etc/ssl/vms.key;
    ssl_protocols       TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;

    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    client_max_body_size 25m;   # allow document uploads

    # Static React builds per subdomain
    location / {
        root /var/www/admin-portal;   # or vendor-portal
        try_files $uri /index.html;
    }

    # Everything else → Kong API Gateway
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://kong:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Authorization $http_authorization;
    }

    location ~ ^/api/(auth/.*|tenants/.*/login)$ {
        limit_req zone=login burst=5 nodelay;
        proxy_pass http://kong:8000;
    }
}
```

---

## 4. API Gateway — Kong

Kong is the single public entry point. It validates the JWT, extracts the `tenant_id` claim, applies rate limits, and routes to the correct internal service.

| Route Prefix | Upstream Service | Port | Notes |
|---|---|---|---|
| `/api/v1/auth/*` | Auth Service | 3021 | Login, refresh, password reset, MFA |
| `/api/v1/tenants/*` | Tenant Service | 3022 | Tenant admin, internal users, RBAC |
| `/api/v1/vendors/*` | Vendor Service | 3023 | Vendor profile, status, search |
| `/api/v1/documents/*` | Document Service | 3024 | Upload, verify, expiry |
| `/api/v1/contracts/*` | Contract Service | 3025 | Contracts, renewals, e-sign |
| `/api/v1/purchase-orders/*` | Purchase Order Service | 3026 | PO lifecycle, line items |
| `/api/v1/invoices/*` | Invoice Service | 3027 | Invoices, aging, approval |
| `/api/v1/payments/*` | Payment Service | 3028 | Payments, remittance |
| `/api/v1/performance/*` | Performance Service | 3029 | Scorecards, reviews |
| `/api/v1/notifications/*` | Notification Service | 3030 | In-app, email, SMS |
| `/api/v1/reports/*` | Reporting Service | 3031 | Dashboards, exports |
| `/api/v1/audit/*` | Audit Service | 3032 | Immutable audit trail |

**Kong plugins:** `jwt` (verify + parse claims), `acl` (role-based route access), `rate-limiting` (per route + per consumer), `cors` (strict allowlist), `prometheus` (metrics), `request-transformer` (inject `X-Tenant-Id` header from JWT claim).

---

## 5. Micro-services

All services are internal-only behind Kong. Each follows the same card: **Database** → **Responsibilities** → **Endpoints**.

### 5.1 Auth Service — Port 3021
- **Database:** Neon PostgreSQL (table: `tenant_users`, `vendor_users`)
- **Responsibilities:** Login/logout, password reset, refresh-token rotation, MFA (TOTP), JWT issuance with `tenant_id` + `role` claims, session invalidation.
- **Endpoints:** `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`, `POST /auth/password/reset`, `POST /auth/mfa/verify`

### 5.2 Tenant Service — Port 3022
- **Database:** Neon PostgreSQL (tables: `tenants`, `roles`, `permissions`, `tenant_users`)
- **Responsibilities:** Tenant provisioning, internal-user CRUD, role assignment, category & approval-rule configuration, subscription/billing metadata.
- **Endpoints:** `POST /tenants` (provision), `GET /tenants/:id`, `POST /tenants/:id/users`, `GET /tenants/:id/users`, `PUT /users/:id`, `DELETE /users/:id`, `POST /tenants/:id/categories`, `GET /tenants/:id/approval-rules`

### 5.3 Vendor Service — Port 3023
- **Database:** Neon PostgreSQL (tables: `vendors`, `vendor_users`)
- **Responsibilities:** Vendor profile lifecycle, onboarding status state machine, vendor search & filtering, vendor-user invitations.
- **Endpoints:** `POST /vendors`, `GET /vendors` (filter/sort/paginate), `GET /vendors/:id`, `PUT /vendors/:id`, `POST /vendors/:id/invite-user`, `POST /vendors/:id/approve`, `POST /vendors/:id/reject`, `POST /vendors/:id/suspend`

### 5.4 Document Service — Port 3024
- **Database:** Neon PostgreSQL (`vendor_documents`) + S3 (files)
- **Responsibilities:** Pre-signed S3 upload URLs, MIME/size validation, antivirus scan trigger, verification workflow, expiry tracking.
- **Endpoints:** `POST /documents/upload-url`, `POST /documents` (register uploaded file), `GET /documents?vendor_id=`, `PUT /documents/:id/verify` (accept/reject), `GET /documents/expiring`

### 5.5 Contract Service — Port 3025
- **Database:** Neon PostgreSQL (`contracts`)
- **Responsibilities:** Contract create/version/renew, status lifecycle, renewal alerts, optional e-sign integration.
- **Endpoints:** `POST /contracts`, `GET /contracts`, `GET /contracts/:id`, `PUT /contracts/:id`, `GET /contracts/expiring`, `POST /contracts/:id/sign`

### 5.6 Purchase Order Service — Port 3026
- **Database:** Neon PostgreSQL (`purchase_orders`, `po_line_items`)
- **Responsibilities:** PO creation with line items, link to vendor & contract, status transitions (Draft→Sent→Accepted→Completed/Cancelled), vendor acknowledgment.
- **Endpoints:** `POST /purchase-orders`, `GET /purchase-orders`, `GET /purchase-orders/:id`, `PUT /purchase-orders/:id/status`, `POST /purchase-orders/:id/acknowledge` (vendor)

### 5.7 Invoice Service — Port 3027
- **Database:** Neon PostgreSQL (`invoices`, `invoice_line_items`)
- **Responsibilities:** Invoice submission against PO, 3-way match (PO ↔ receipt ↔ invoice) validation, aging-bucket computation, finance approve/reject workflow.
- **Endpoints:** `POST /invoices`, `GET /invoices` (with `aging_bucket` filter), `GET /invoices/:id`, `PUT /invoices/:id/approve`, `PUT /invoices/:id/reject`

### 5.8 Payment Service — Port 3028
- **Database:** Neon PostgreSQL (`payments`)
- **Responsibilities:** Payment scheduling, remittance recording, reconciliation status, payout gateway integration.
- **Endpoints:** `POST /payments` (schedule), `GET /payments`, `GET /payments/:id`, `PUT /payments/:id/mark-paid`

### 5.9 Performance Service — Port 3029
- **Database:** Neon PostgreSQL (`performance_reviews`)
- **Responsibilities:** Scorecard computation (reliability, response time, delivery quality, issue handling), periodic review creation, trend aggregation.
- **Endpoints:** `POST /performance/reviews`, `GET /performance/reviews`, `GET /performance/:vendorId/trend`

### 5.10 Notification Service — Port 3030
- **Database:** Neon PostgreSQL (`notifications`) + Email/SMS gateway
- **Responsibilities:** Consumes RabbitMQ events, renders templates, sends email + in-app + SMS, manages delivery status & user preferences.
- **Endpoints:** `GET /notifications`, `PUT /notifications/:id/read`, `PUT /users/:id/preferences`

### 5.11 Reporting Service — Port 3031
- **Database:** Neon PostgreSQL (read replicas) + Redis (cached aggregates)
- **Responsibilities:** Dashboard summary aggregates, saved views, PDF/CSV export, scheduled report delivery.
- **Endpoints:** `GET /reports/dashboard-summary`, `GET /reports/vendor-performance`, `GET /reports/invoice-aging`, `POST /reports/export` (format=pdf|csv)

### 5.12 Audit Service — Port 3032
- **Database:** Neon PostgreSQL (`audit_logs`, append-only)
- **Responsibilities:** Receives structured audit events from every service, immutable storage, compliance export, tamper-evident chaining.
- **Endpoints:** `GET /audit?entity_type=&entity_id=`, `GET /audit/export`, `GET /audit/verify-chain`

---

## 6. Data Layer

| Store | Technology | Used By | Notes |
|---|---|---|---|
| Primary relational DB | **Neon PostgreSQL** (serverless) | All services | One shared cluster; tenant isolation via `tenant_id` + RLS. Branches: `main` (prod), `staging`, `dev/{engineer}` |
| File storage | **AWS S3** | Document, Contract, Invoice | Pre-signed URLs; objects tagged with `tenant_id` for access policies |
| Cache / sessions | **Redis** (Upstash) | Auth, Notification, Reporting | Refresh tokens, rate-limit counters, cached aggregates |
| Message broker | **RabbitMQ** | All async events | Durable queues, per-event routing keys |
| Real-time updates | Redis Pub/Sub | Vendor, Invoice, Notification | Live status changes pushed to dashboards |
| Search (future) | OpenSearch | Vendor, Invoice, Audit | Replaces ILIKE scans once dataset grows |

---

## 7. Database Schema (Neon PostgreSQL)

All tenant-scoped tables carry `tenant_id UUID NOT NULL`. Primary keys are UUID v4. Timestamps are `TIMESTAMPTZ` (UTC). Enums are enforced via `CHECK` constraints. Money uses `NUMERIC(14,2)`. Indexes are created on every foreign key and common filter column.

```sql
-- ============================================================
-- TENANCY & ACCESS
-- ============================================================

tenants (
  id UUID PK,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,                 -- subdomain / URL key
  plan TEXT CHECK (plan IN ('free','pro','enterprise')),
  status TEXT CHECK (status IN ('active','suspended','cancelled')),
  created_at TIMESTAMPTZ DEFAULT now()
)

roles (
  id UUID PK,
  tenant_id UUID FK REFERENCES tenants(id),
  name TEXT CHECK (name IN
    ('tenant_admin','procurement','finance','operations','vendor_manager','vendor_user')),
  UNIQUE (tenant_id, name)
)

permissions (
  id UUID PK,
  role_id UUID FK REFERENCES roles(id),
  scope TEXT NOT NULL,                       -- e.g. 'vendors', 'invoices'
  actions TEXT[] NOT NULL                    -- {'read','write','approve'}
)

tenant_users (                               -- internal buyer-company staff
  id UUID PK,
  tenant_id UUID FK REFERENCES tenants(id),
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,               -- bcrypt/argon2
  full_name TEXT NOT NULL,
  role_id UUID FK REFERENCES roles(id),
  mfa_secret TEXT,                           -- TOTP, NULL if disabled
  status TEXT CHECK (status IN ('active','invited','disabled')),
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (tenant_id, email)
)

-- ============================================================
-- VENDORS
-- ============================================================

vendors (
  id UUID PK,
  tenant_id UUID FK REFERENCES tenants(id),
  vendor_name TEXT NOT NULL,
  vendor_code TEXT,                          -- tenant-assigned code
  category TEXT,                             -- e.g. 'IT Services', 'Logistics'
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  tax_id TEXT,                               -- GST/PAN/VAT
  legal_address TEXT,
  bank_account_ref TEXT,                     -- tokenized; never raw account #
  status TEXT CHECK (status IN
    ('draft','submitted','under_review','approved','rejected','suspended')),
  onboarded_by UUID REFERENCES tenant_users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (tenant_id, vendor_code)
)

vendor_users (                               -- external vendor-side logins
  id UUID PK,
  tenant_id UUID FK REFERENCES tenants(id),  -- tenant this vendor belongs to
  vendor_id UUID FK REFERENCES vendors(id),
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  status TEXT CHECK (status IN ('invited','active','disabled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (tenant_id, vendor_id, email)
)

vendor_documents (
  id UUID PK,
  tenant_id UUID FK REFERENCES tenants(id),
  vendor_id UUID FK REFERENCES vendors(id),
  document_type TEXT CHECK (document_type IN
    ('pan','gst','registration','insurance','bank_proof','msme','other')),
  file_key TEXT NOT NULL,                    -- S3 object key
  file_hash TEXT,                            -- SHA-256 for integrity/dedup
  verification_status TEXT CHECK (verification_status IN
    ('pending','accepted','rejected','expired')),
  expires_on DATE,
  verified_by UUID REFERENCES tenant_users(id),
  verified_at TIMESTAMPTZ,
  uploaded_at TIMESTAMPTZ DEFAULT now()
)

-- ============================================================
-- PROCUREMENT
-- ============================================================

contracts (
  id UUID PK,
  tenant_id UUID FK REFERENCES tenants(id),
  vendor_id UUID FK REFERENCES vendors(id),
  contract_number TEXT NOT NULL,
  title TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  value NUMERIC(14,2),
  file_key TEXT,                             -- signed contract PDF
  status TEXT CHECK (status IN
    ('draft','active','expiring_soon','expired','terminated')),
  version INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (tenant_id, contract_number)
)

purchase_orders (
  id UUID PK,
  tenant_id UUID FK REFERENCES tenants(id),
  vendor_id UUID FK REFERENCES vendors(id),
  contract_id UUID REFERENCES contracts(id),
  po_number TEXT NOT NULL,
  order_date DATE NOT NULL,
  expected_delivery DATE,
  total_amount NUMERIC(14,2) NOT NULL,
  currency CHAR(3) DEFAULT 'USD',
  status TEXT CHECK (status IN
    ('draft','sent','accepted','partial','completed','cancelled')),
  created_by UUID REFERENCES tenant_users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (tenant_id, po_number)
)

po_line_items (
  id UUID PK,
  purchase_order_id UUID FK REFERENCES purchase_orders(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC(12,2) NOT NULL,
  unit_price NUMERIC(14,2) NOT NULL,
  line_total NUMERIC(14,2) GENERATED ALWAYS AS (quantity * unit_price) STORED
)

-- ============================================================
-- INVOICING & PAYMENTS
-- ============================================================

invoices (
  id UUID PK,
  tenant_id UUID FK REFERENCES tenants(id),
  vendor_id UUID FK REFERENCES vendors(id),
  purchase_order_id UUID REFERENCES purchase_orders(id),
  invoice_number TEXT NOT NULL,
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  subtotal NUMERIC(14,2) NOT NULL,
  tax_amount NUMERIC(14,2) DEFAULT 0,
  total_amount NUMERIC(14,2) NOT NULL,
  currency CHAR(3) DEFAULT 'USD',
  payment_status TEXT CHECK (payment_status IN
    ('pending','approved','rejected','paid','overdue')),
  match_status TEXT CHECK (match_status IN
    ('unmatched','matched','disputed')),     -- 3-way match outcome
  file_key TEXT,
  approved_by UUID REFERENCES tenant_users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (tenant_id, invoice_number)
)

invoice_line_items (
  id UUID PK,
  invoice_id UUID FK REFERENCES invoices(id) ON DELETE CASCADE,
  po_line_item_id UUID REFERENCES po_line_items(id),
  description TEXT NOT NULL,
  quantity NUMERIC(12,2) NOT NULL,
  unit_price NUMERIC(14,2) NOT NULL,
  line_total NUMERIC(14,2) GENERATED ALWAYS AS (quantity * unit_price) STORED
)

payments (
  id UUID PK,
  tenant_id UUID FK REFERENCES tenants(id),
  invoice_id UUID FK REFERENCES invoices(id),
  amount NUMERIC(14,2) NOT NULL,
  currency CHAR(3) DEFAULT 'USD',
  paid_on DATE NOT NULL,
  method TEXT CHECK (method IN ('bank_transfer','check','card','upi','other')),
  reference TEXT,                            -- remittance reference
  status TEXT CHECK (status IN ('scheduled','processed','failed','reconciled')),
  created_by UUID REFERENCES tenant_users(id),
  created_at TIMESTAMPTZ DEFAULT now()
)

-- ============================================================
-- PERFORMANCE, APPROVALS, NOTIFICATIONS, AUDIT
-- ============================================================

performance_reviews (
  id UUID PK,
  tenant_id UUID FK REFERENCES tenants(id),
  vendor_id UUID FK REFERENCES vendors(id),
  review_period TEXT NOT NULL,               -- e.g. '2026-Q2'
  reliability_score   INT CHECK (reliability_score   BETWEEN 0 AND 100),
  responsiveness_score INT CHECK (responsiveness_score BETWEEN 0 AND 100),
  quality_score       INT CHECK (quality_score       BETWEEN 0 AND 100),
  overall_score       INT CHECK (overall_score       BETWEEN 0 AND 100),
  comments TEXT,
  reviewed_by UUID REFERENCES tenant_users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (tenant_id, vendor_id, review_period)
)

approval_steps (                             -- flexible, tenant-configurable workflow
  id UUID PK,
  tenant_id UUID FK REFERENCES tenants(id),
  entity_type TEXT CHECK (entity_type IN ('vendor','document','contract','invoice')),
  entity_id UUID NOT NULL,
  step_order INT NOT NULL,
  approver_role TEXT,
  decision TEXT CHECK (decision IN ('pending','approved','rejected','returned')),
  decided_by UUID REFERENCES tenant_users(id),
  decided_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
)

notifications (
  id UUID PK,
  tenant_id UUID FK REFERENCES tenants(id),
  recipient_user_id UUID,                    -- tenant_user OR vendor_user
  recipient_vendor_user_id UUID,
  channel TEXT CHECK (channel IN ('in_app','email','sms')),
  template_key TEXT NOT NULL,
  payload JSONB,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
)

audit_logs (                                 -- append-only, tamper-evident
  id UUID PK,
  tenant_id UUID FK REFERENCES tenants(id),
  actor_id UUID,                             -- tenant_user OR vendor_user
  actor_type TEXT CHECK (actor_type IN ('tenant_user','vendor_user','system')),
  action TEXT NOT NULL,                      -- e.g. 'vendor.approve'
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  changes JSONB,                             -- before/after diff
  prev_hash TEXT,                            -- chaining for tamper-evidence
  row_hash TEXT,                             -- SHA-256 of this row
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT now()
)

-- Representative indexes (FK columns + common filters)
CREATE INDEX idx_vendors_tenant_status     ON vendors (tenant_id, status);
CREATE INDEX idx_documents_expiring        ON vendor_documents (tenant_id, expires_on)
                                          WHERE verification_status = 'accepted';
CREATE INDEX idx_invoices_aging            ON invoices (tenant_id, due_date, payment_status);
CREATE INDEX idx_contracts_expiring        ON contracts (tenant_id, end_date, status);
CREATE INDEX idx_po_vendor                 ON purchase_orders (tenant_id, vendor_id, status);
CREATE INDEX idx_audit_entity              ON audit_logs (tenant_id, entity_type, entity_id, created_at DESC);
```

**Note on money & numbers:** all monetary columns use `NUMERIC` (no floats); invoice/PO totals are computed via `GENERATED ALWAYS AS ... STORED` columns to prevent drift. Quantity/unit-price fields use tabular numeric types that align cleanly in UI tables (see §10 typography rule `number-tabular`).

---

## 8. Multi-Tenancy & Row-Level Security

Tenant isolation is enforced at **three layers** so that a bug in any one cannot leak data across tenants:

1. **Application layer** — every query is scoped by `tenant_id` taken from the verified JWT (injected by Kong as the `X-Tenant-Id` header). Service repositories always filter `WHERE tenant_id = :current_tenant`.
2. **Database layer (RLS)** — Postgres Row-Level Security policies guarantee that even a malformed query cannot cross tenant boundaries, regardless of application bugs.
3. **Storage layer** — S3 object access policies are scoped by `tenant_id` tag, and pre-signed URLs are short-lived.

**Row-Level Security setup:**

```sql
-- Enable RLS on every tenant-scoped table
ALTER TABLE vendors              ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_documents     ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts            ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices             ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments             ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_reviews  ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_steps       ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications        ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs           ENABLE ROW LEVEL SECURITY;

-- App connections use the 'app_user' role, which carries the session variable
-- SET app.tenant_id = '<uuid>'  (set once per request in the connection pool)

CREATE POLICY tenant_isolation ON vendors
  USING (tenant_id = current_setting('app.tenant_id')::uuid);

-- The same policy shape is applied to every tenant-scoped table.
-- Superusers bypass RLS; the read-only 'reporting_role' uses a separate
-- policy that allows cross-tenant aggregation only inside the Reporting Service.
```

**Least-privilege DB roles:**

| Role | Purpose | RLS | Privileges |
|---|---|---|---|
| `app_user` | Service runtime connections | Enforced (session `tenant_id`) | CRUD on tenant-scoped tables |
| `reporting_role` | Reporting Service aggregates | Tenant-aware views only | SELECT on materialized aggregate views |
| `migration_role` | Schema migrations | BYPASSRLS | DDL only, no row data access |
| `audit_writer` | Audit Service inserts | Insert-only on `audit_logs` | INSERT only, no UPDATE/DELETE |

**Neon platform fit (per `neon-postgres` guidance):** Neon's serverless compute with scale-to-zero suits bursty SaaS traffic; built-in PgBouncer pools connections for the many short-lived FastAPI workers; and **DB branching** lets each engineer test schema migrations against a full copy of production (`dev/{engineer}` branches) before merging to `main`. The `DATABASE_URL` lives in environment variables only and is never committed.

---

## 9. UI/UX Design System

The design system is defined once as a **master** (shared tokens) and overridden per portal (Admin vs Vendor), following the **Pattern → Style → Colors → Typography → Effects → Anti-patterns** contract.

### 9.1 Pattern
- **Admin Portal:** persistent left sidebar + top bar + content region (desktop-first enterprise dashboard pattern). Breadcrumbs at 3+ levels. Data-dense tables with sticky headers.
- **Vendor Portal:** top horizontal nav + content region (friendlier, lower-density SaaS pattern). Focused task pages, fewer simultaneous options.

### 9.2 Style — Flat / Minimalism
Data-first, low chrome, disciplined elevation. No glassmorphism, no neumorphism, no skeuomorphism. SVG icons only (no emoji-as-icon). Style is **identical across both portals** for consistency; only density and accent color differ.

### 9.3 Colors — Semantic Tokens (validated to WCAG AA 4.5:1)

Tokens, not raw hex, are referenced in components. Two palettes — both share neutrals; the Admin portal uses a confident **navy/indigo** accent, the Vendor portal a friendlier **blue**.

**Shared neutrals + semantic colors (both portals):**

| Token | Hex | On-token | Contrast | Use |
|---|---|---|---|---|
| `surface` | `#FFFFFF` | — | — | App background |
| `surface-muted` | `#F7F8FA` | — | — | Table stripes, panels |
| `border` | `#E2E5EB` | — | — | Dividers, table grid |
| `on-surface` | `#0F172A` (slate-900) | on `surface` | 16.4:1 AAA | Primary text |
| `on-surface-muted` | `#475569` (slate-600) | on `surface` | 8.0:1 AAA | Secondary text |
| `success` | `#15803D` (green-700) | `#FFFFFF` | 4.9:1 AA | Approved / paid |
| `warning` | `#B45309` (amber-700) | `#FFFFFF` | 4.6:1 AA | Pending / due soon |
| `danger` | `#B91C1C` (red-700) | `#FFFFFF` | 5.9:1 AA | Rejected / overdue |
| `info` | `#1D4ED8` (blue-700) | `#FFFFFF` | 6.4:1 AA | Informational |

**Status badges always pair color + text + icon** (rule `color-not-only`) so they remain legible for color-blind users and on monochrome printouts.

**Accent (portal-specific):**

| Portal | `primary` | `primary-hover` | `on-primary` | Contrast |
|---|---|---|---|---|
| Admin | `#3730A3` (indigo-800) | `#312E81` | `#FFFFFF` | 9.4:1 AAA |
| Vendor | `#2563EB` (blue-600) | `#1D4ED8` | `#FFFFFF` | 5.2:1 AA |

### 9.4 Typography

| Role | Font | Scale / weight |
|---|---|---|
| Headings + body | **Inter** (Google Fonts) | Type scale: 12 / 14 / 16 / 18 / 24 / 32 px |
| Data figures | **IBM Plex Mono** | Tabular figures for amounts, PO numbers, aging — prevents column jitter (`number-tabular`) |

- Weights: headings 600–700, body 400, labels 500 (`weight-hierarchy`).
- Body line-height 1.5–1.6 (`line-height`). Minimum body size 14 px; never below 12 px.

### 9.5 Effects — Elevation & Radius Scale (consistent)

| Token | Box-shadow | Radius | Use |
|---|---|---|---|
| `elevation-0` | none | 6 px | Inline elements |
| `elevation-1` | `0 1px 2px rgba(15,23,42,0.06)` | 8 px | Cards, panels |
| `elevation-2` | `0 4px 12px rgba(15,23,42,0.08)` | 10 px | Popovers, dropdowns |
| `elevation-3` | `0 12px 32px rgba(15,23,42,0.12)` | 12 px | Modals, drawers |

One consistent elevation scale — no ad-hoc shadow values (rule `elevation-consistent`). Dark-mode variants designed alongside light mode (`dark-mode-pairing`).

### 9.6 UX Rules Applied (named slugs from the design system)

- **Data tables:** sortable columns with `aria-sort` (`sortable-table`); tabular figures (`number-tabular`); wrap-then-truncate with tooltip (`truncation-strategy`); pattern fill on charts to supplement color (`pattern-texture`).
- **Forms (onboarding, invoice entry):** visible labels above inputs (`input-labels`); inline validation on blur (`inline-validation`); error text directly below the field with cause + fix (`error-placement`, `error-clarity`); required-field indicators (`required-indicators`); multi-step progress indicator (`multi-step-progress`); autosave drafts (`form-autosave`); confirm before discarding unsaved input (`sheet-dismiss-confirm`).
- **Navigation:** sidebar (≥1024 px) collapsing to a top bar + drawer (`adaptive-navigation`); breadcrumbs at 3+ levels (`breadcrumb-web`); preserve scroll/filter state on back (`state-preservation`); deep-linkable views (`deep-linking`).
- **Dashboards & feedback:** skeleton loaders for >300 ms (`progressive-loading`); helpful empty states with a primary action (`empty-states`); toasts 3–5 s with undo for destructive ops (`toast-dismiss`, `undo-support`); confirmation dialogs for irreversible actions (`confirmation-dialogs`).
- **Accessibility (always):** 4.5:1 contrast (`color-contrast`); visible focus rings (`focus-states`); full keyboard nav (`keyboard-nav`); ARIA labels on icon-only buttons (`aria-labels`); `prefers-reduced-motion` respected (`reduced-motion`).

### 9.7 Chart-Type Mapping

| Data | Chart | Rationale |
|---|---|---|
| Vendor performance over time | **Line chart** | Trend (`trend-emphasis`, switchable day/week/month) |
| Spend by vendor / comparison | **Bar chart** | Comparison; horizontal on narrow viewports (`responsive-chart`) |
| Invoice aging buckets (0–30/31–60/61–90/90+) | **Bar chart** | Ordinal comparison — not pie, per `no-pie-overuse` |
| Spend by category (≤5 categories) | **Donut** | Proportion |
| Single KPI (active vendors, overdue $) | **Big-number card** with delta vs prior period | `direct-labeling` |

Every chart: visible legend (`legend-visible`), hover/keyboard tooltip (`tooltip-on-interact`, `tooltip-keyboard`), subtle gridlines at border-gray (`gridline-subtle`), data-series contrast ≥3:1 (`contrast-data`), and a `screen-reader-summary` of the key insight.

### 9.8 Anti-patterns to avoid
Raw hex inside components; placeholder-only labels; errors only at the top of a page; hover-only interactions; relying on color alone for status; mixing flat and skeuomorphic styles; animating `width/height`; 0 ms state changes; disabled-zoom / fixed pixel widths on mobile.

---

## 10. UI Wireframes (ASCII)

### 10.1 Buyer Admin — Dashboard
```
┌──────────────────────────────────────────────────────────────────────┐
│ ☰ VMS   [ Search vendors, POs, invoices... ]      🔔 ⑤  👤 A. Rao ▾ │
├────────────┬─────────────────────────────────────────────────────────┤
│ Dashboard  │  Dashboard                              [Export ▾] [＋PO]│
│ Vendors    │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│ Approvals  │  │ Active   │ │ Pending  │ │ Open POs │ │ Overdue  │   │
│ Contracts  │  │ Vendors  │ │ Approvals│ │          │ │ Invoices │   │
│ Purch. Ord.│  │   128    │ │    7     │ │   42     │ │  $18.4k  │   │
│ Invoices   │  │ ▲ 12%    │ │ ⚠ action │ │          │ │ 🔴 alert │   │
│ Payments   │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│ Performance│                                                         │
│ Reports    │  Spend by Vendor (6 mo)      Invoice Aging              │
│ Users      │  ▆▅▇▆▇▅▇▆▅▇▆                │0-30│31-60│61-90│90+│      │
│ Settings   │  Acme  ▇▇▇▇▇                 │ 22 │  9  │  4  │ 2 │      │
│            │  Globex▇▇▇▆                  └────┴─────┴─────┴───┘     │
│            │                                                         │
│            │  Action Required                                       │
│            │  • 5 vendors awaiting document review     [Review →]    │
│            │  • 3 invoices past due                    [Open →]      │
│            │  • 2 contracts expiring <30 days          [Renew →]     │
└────────────┴─────────────────────────────────────────────────────────┘
```

### 10.2 Buyer Admin — Vendors List (data table)
```
┌──────────────────────────────────────────────────────────────────────┐
│ Vendors    [Status ▾] [Category ▾] [Search...]        [＋ New Vendor]│
├──────────────────────────────────────────────────────────────────────┤
│ ☐  Vendor           │ Code │ Category   │ Status       │ Updated     │
├─────────────────────┼──────┼────────────┼──────────────┼─────────────┤
│ ☐  Acme Logistics   │ V-01 │ Logistics  │ ● Approved   │ 2026-06-18  │
│ ☐  Globex IT        │ V-02 │ IT Services│ ◐ Under review│ 2026-06-19 │
│ ☐  Initech Supplies │ V-03 │ Office     │ ● Approved   │ 2026-06-12  │
│ ☐  Umbra Corp       │ V-04 │ Facilities │ ○ Draft      │ 2026-06-20  │
│                     │      │            │              │             │
│ Showing 1–4 of 128                       ‹ 1 2 3 ... 32 ›            │
└──────────────────────────────────────────────────────────────────────┘
 Legend: ● Approved   ◐ Pending   ○ Draft   ✕ Rejected   ⊘ Suspended
```

### 10.3 Vendor Portal — Onboarding Wizard (multi-step)
```
┌──────────────────────────────────────────────────────────────────────┐
│ Vendor Portal          Step 2 of 5 ── Company Details                │
├──────────────────────────────────────────────────────────────────────┤
│  ① Company ──●── ② Details ──○── ③ Documents ──○── ④ Bank ──○── ⑤ Review │
│                                                                       │
│  Legal Company Name *                                                │
│  [ Acme Logistics Pvt Ltd                              ]             │
│                                                                       │
│  Tax ID (GST) *                Category *                            │
│  [ 27ABCDE1234F1Z5 ]           [ Logistics ▾ ]                        │
│                                                                       │
│  ⚠ This field is required: Tax ID must be 15 characters.             │
│                                                                       │
│                       [ Save & exit ]      [ ‹ Back ]  [ Next › ]    │
└──────────────────────────────────────────────────────────────────────┘
```

### 10.4 Vendor Portal — Dashboard
```
┌──────────────────────────────────────────────────────────────────────┐
│ Acme Logistics   [ Search... ]                    🔔 ③  👤 Profile ▾ │
├──────────────────────────────────────────────────────────────────────┤
│  Welcome back — your registration is ● Approved.                     │
│                                                                       │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐  │
│  │ Pending Docs │ │ Active POs   │ │ Open Invoices│ │ Paid (30d) │  │
│  │     2        │ │     3        │ │     5        │ │  $24,500   │  │
│  └──────────────┘ └──────────────┘ └──────────────┘ └────────────┘  │
│                                                                       │
│  Action needed                                                        │
│  • Insurance certificate expires in 12 days        [ Upload now ]    │
│  • PO V-PO-0214 awaiting your acceptance           [ Review ]        │
│  • Invoice INV-9913 returned for correction        [ Fix & resubmit] │
└──────────────────────────────────────────────────────────────────────┘
```

### 10.5 Document Upload (drag-drop, progress, validation)
```
┌──────────────────────────────────────────────────────────────────────┐
│ Upload Document — GST Certificate                                    │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                 ⤓  Drag & drop or [ Browse ]                  │  │
│  │            PDF, PNG, JPG · max 10 MB                          │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  gst_cert_2026.pdf     ▓▓▓▓▓▓▓▓▓▓ 100%   ✓ Uploaded — SHA-256 verified│
│  expires_on: 2027-04-30                                              │
│                                                                       │
│  [ Cancel ]                                          [ Submit ]       │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 11. Security

- **RBAC** via `roles` + `permissions` tables; roles include `tenant_admin`, `procurement`, `finance`, `operations`, `vendor_manager` (buyer side) and `vendor_user` (vendor side). Kong `acl` plugin enforces route-level access.
- **Authentication:** bcrypt/argon2 password hashing; JWT access tokens (short-lived) + rotating refresh tokens stored in Redis; optional TOTP MFA for buyer admins.
- **Tenant isolation:** JWT carries `tenant_id`; services set the session variable; RLS policies enforce row-level isolation (§8).
- **Encryption:** TLS 1.3 in transit; column-level encryption for tokenized bank-account refs; S3 server-side encryption (SSE-KMS) at rest.
- **Document access:** short-lived pre-signed S3 URLs (≤15 min); object tags enforce tenant scoping; antivirus scan before `accepted`.
- **Auditability:** every state-changing action writes an immutable, hash-chained `audit_logs` row (§7).
- **Secrets:** all credentials/`DATABASE_URL` in environment variables / secrets manager — never committed.
- **Rate limiting & abuse:** login 5/min/IP, upload 10/min/IP, general API 60/min/IP (§3).

---

## 12. Infrastructure & DevOps

**Dev:** Each engineer clones only the service/UI repos they need. The **`vms-infra` repo** holds a `docker-compose.yml` that orchestrates Nginx + Kong + all 12 services + a local Neon branch + Redis + RabbitMQ for end-to-end local runs. Each engineer develops against a personal **Neon branch** (`dev/{engineer}`) for safe schema experimentation.

**Prod:** Kubernetes — CPU pool for all services, optional separate pool if any service needs GPU/OCR later. Horizontal pod autoscaling per service on CPU + request-rate.

```
┌─────────────────────────────────────────────────────────────────┐
│  Kubernetes Cluster                                              │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────────────────┐ │
│  │ Ingress  │→ │ Kong GW  │→ │ Services (12x FastAPI pods)   │ │
│  │ + Nginx  │  │ + JWT    │  │ HPA on CPU + RPS              │ │
│  └──────────┘  └──────────┘  └───────────────┬───────────────┘ │
│                                                │                 │
│  ┌──────────────────┐  ┌─────────────┐  ┌─────▼─────┐          │
│  │ RabbitMQ         │  │ Redis       │  │ Neon PG   │          │
│  │ (async events)   │  │ (cache/sess)│  │ (RLS)     │          │
│  └──────────────────┘  └─────────────┘  └───────────┘          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Observability: Prometheus → Grafana · Loki (logs)        │  │
│  │                Uptime Kuma · Sentry (errors)             │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

- **Backups:** Neon automated PITR + nightly S3 cross-region replication.
- **Migrations:** Alembic (FastAPI) in the `vms-db` repo, applied by `migration_role` (BYPASSRLS, DDL-only). Migration PRs run against a throwaway Neon branch first.

### 12.1 CI/CD with GitHub Actions

**Strategy.** Because every service and UI app lives in its own repo (§16), CI boilerplate would explode across 14 pipelines. To keep them DRY, two **reusable workflows** (`workflow_call`) live in the **`vms-infra` repo** at `.github/workflows/`. Each application repo contains only a thin `ci.yml` that calls the shared workflow via `uses: <org>/vms-infra/.github/workflows/<file>.yml@<ref>` and passes its name/port as inputs. ([Reuse workflows](https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows) · [Reusing workflow configurations](https://docs.github.com/en/actions/reference/workflows-and-actions/reusing-workflow-configurations))

Images are pushed to **GitHub Container Registry (GHCR)** at `ghcr.io/<org>/<service>`. All deploy authentication uses **OpenID Connect (OIDC)** — no long-lived cloud credentials or static PATs are ever stored. ([OpenID Connect](https://docs.github.com/en/actions/concepts/security/openid-connect) · [OIDC with reusable workflows](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-with-reusable-workflows))

**Reusable workflow for the 12 FastAPI services** — `vms-infra/.github/workflows/service-ci.yml`:

```yaml
name: Reusable - FastAPI service CI
on:
  workflow_call:
    inputs:
      service-name: { required: true, type: string }   # e.g. "vendor-service"
      service-port: { required: true, type: string }   # e.g. "3023"
      docker-context: { required: false, type: string, default: "." }

jobs:
  test:
    runs-on: ubuntu-latest
    permissions: { contents: read }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
          cache: pip                                 # dependency caching
      - run: pip install -U uv && uv pip install --system -r requirements.txt
      - run: ruff check .
      - run: mypy app
      - run: pytest --cov=app --cov-report=xml
      - uses: codecov/codecov-action@v4              # upload coverage

  build-push:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write                                # push to GHCR
      id-token: write                                # OIDC for provenance attestation
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}       # short-lived, no PAT
      - uses: docker/metadata-action@v5
        id: meta
        with:
          images: ghcr.io/${{ github.repository_owner }}/${{ inputs.service-name }}
          tags: |
            type=raw,value=latest,enable=${{ github.ref == 'refs/heads/main' }}
            type=sha,prefix={{date 'YYYYMMDD'}}-
            type=semver,pattern={{version}}
      - uses: docker/build-push-action@v6
        with:
          context: ${{ inputs.docker-context }}
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          build-args: |
            SERVICE_PORT=${{ inputs.service-port }}
      - uses: actions/attest-build-provenance@v1       # SLSA provenance (artifact attestation)
        with:
          subject-name: ghcr.io/${{ github.repository_owner }}/${{ inputs.service-name }}
          subject-digest: ${{ steps.meta.outputs.version }}
```

**Reusable workflow for the 2 React/Vite portals** — `vms-infra/.github/workflows/web-ci.yml`:

```yaml
name: Reusable - React/Vite web CI
on:
  workflow_call:
    inputs:
      app-name: { required: true, type: string }      # e.g. "admin-portal"

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
      id-token: write                                 # OIDC for GHCR + provenance
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm test                                 # vitest
      - run: npm run build                            # vite build -> dist/
      - uses: actions/upload-artifact@v4              # upload SPA bundle
        with: { name: ${{ inputs.app-name }}-dist, path: dist/ }
      - uses: docker/login-action@v3
        with: { registry: ghcr.io, username: ${{ github.actor }}, password: ${{ secrets.GITHUB_TOKEN }} }
      - uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ghcr.io/${{ github.repository_owner }}/${{ inputs.app-name }}:latest,ghcr.io/${{ github.repository_owner }}/${{ inputs.app-name }}:${{ github.sha }}
      - uses: actions/attest-build-provenance@v1
        with:
          subject-name: ghcr.io/${{ github.repository_owner }}/${{ inputs.app-name }}
          subject-digest: ${{ github.sha }}
```
See [Building and testing Node.js](https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs) and [Run jobs in a container](https://docs.github.com/en/actions/how-tos/write-workflows/choose-where-workflows-run/run-jobs-in-a-container).

**Thin per-repo caller** — `vms-vendor-service/.github/workflows/ci.yml` (one file per repo, ~10 lines each):

```yaml
name: CI
on:
  push: { branches: [main] }
  pull_request:
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true                            # kill superseded runs
jobs:
  ci:
    uses: trainzex-ai-interns/vms-infra/.github/workflows/service-ci.yml@v1
    with:
      service-name: vendor-service
      service-port: "3023"
    secrets: inherit                                  # env secrets flow through
```

**Deploy via protected environments** — `vms-infra/.github/workflows/release-deploy.yml` rolls the freshly built image out to Kubernetes (Argo CD / kubectl) using GitHub **Environments** as the gate. `staging` auto-deploys on merge to `main`; `prod` deploys on a `v*` git tag and requires a human reviewer. ([Deployment environments](https://docs.github.com/en/actions/concepts/workflows-and-actions/deployment-environments) · [Manage environments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments) · [Review deployments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/review-deployments))

```yaml
name: Deploy
on:
  workflow_run:
    workflows: ["Reusable - FastAPI service CI"]
    types: [completed]
    branches: [main]
jobs:
  staging:
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    runs-on: ubuntu-latest
    environment: staging                              # auto, no reviewer
    permissions: { id-token: write, contents: read }
    steps:
      - uses: azure/setup-kubectl@v4
      - run: kubectl set image deployment/vendor-service vendor-service=ghcr.io/trainzex-ai-interns/vendor-service:${{ github.sha }}

  prod:
    if: startsWith(github.ref, 'refs/tags/v')
    needs: staging
    runs-on: ubuntu-latest
    environment:                                      # gated prod env
      name: prod
    permissions: { id-token: write, contents: read }
    steps:
      - uses: azure/setup-kubectl@v4
      - run: kubectl set image deployment/vendor-service vendor-service=ghcr.io/trainzex-ai-interns/vendor-service:${{ github.ref_name }}
```

**Shared-package CI** — the `vms-ui` and `vms-sdk` repos publish to npm on a `v*` tag; `vms-contracts` publishes to private PyPI on a `v*` tag. Consumers pick up new versions via Dependabot (config lives in each consumer repo) rather than manual bumps.

**CI conventions:**

| Convention | Practice |
|---|---|
| DRY across 14 repos | Reusable `workflow_call` workflows (not composite actions — those are for *steps within one job*, reusable workflows are for *whole jobs/pipelines*) |
| Registry | GitHub Container Registry (`ghcr.io`), auth via the short-lived `GITHUB_TOKEN` — no PATs |
| Deploy auth | **OIDC only** (`id-token: write` + cloud trust) — never long-lived keys |
| Supply chain | `actions/attest-build-provenance@v1` on every image (SLSA provenance); ([Artifact attestations](https://docs.github.com/en/actions/concepts/security/artifact-attestations)) |
| Environments | `staging` (auto) + `prod` (required reviewer) + repo-scoped secrets per environment ([Secrets](https://docs.github.com/en/actions/concepts/security/secrets) · [Secure use](https://docs.github.com/en/actions/reference/security/secure-use)) |
| Speed | `setup-python`/`setup-node` caching, `concurrency.cancel-in-progress`, npm `ci` for deterministic installs |
| Quality gates | `ruff` + `mypy` + `pytest --cov` (services); `lint` + `vitest` + `vite build` (web) — enforced as required status checks via branch protection |
| Adjacent tooling | Code scanning (CodeQL) and Dependabot are configured per repo via their own skills, not GitHub Actions YAML — see the `codeql` and `dependabot` skills |

---

## 13. Event Catalog (RabbitMQ)

Durable events published by services and consumed (primarily) by the Notification and Audit services. Real-time UI updates use Redis Pub/Sub on top.

| Event | Published When | Consumer(s) |
|---|---|---|
| `vendor.submitted` | Vendor submits onboarding | Notification → buyer approvers; Audit |
| `vendor.approved` | Buyer approves vendor | Notification → vendor user; Audit |
| `vendor.rejected` | Buyer rejects vendor | Notification → vendor user; Audit |
| `document.expiring` | Cron: doc expiry <15 days | Notification → vendor + buyer; Audit |
| `contract.expiring` | Cron: contract expiry <30 days | Notification → buyer admin; Audit |
| `po.sent` / `po.accepted` | PO lifecycle change | Notification; Reporting (refresh aggregates) |
| `invoice.submitted` | Vendor raises invoice | Notification → finance; Audit |
| `invoice.approved` / `invoice.rejected` | Finance decision | Notification → vendor user; Audit |
| `payment.processed` | Payment marked paid | Notification → vendor user; Reporting; Audit |
| `performance.reviewed` | Scorecard published | Notification → vendor user; Audit |
| `audit.recorded` | Any state change | Audit Service appends + chains hash |

**Redis Pub/Sub channels (real-time):** `tenant:{id}:notifications`, `vendor:{id}:po-updates`, `tenant:{id}:invoice-updates` — subscribed by open dashboard sockets for instant refresh.

---

## 14. API Design

**Conventions:**
- Base path: `/api/v1/...` (URI versioned).
- Auth: `Authorization: Bearer <jwt>` on every request except login/MFA endpoints.
- Tenant header: Kong injects `X-Tenant-Id` from the JWT claim; services trust only this header.
- Pagination: `?page=1&page_size=20` → `{ items, page, page_size, total }`.
- Filtering: resource-specific query params (e.g. `?status=approved&category=it`).
- Sorting: `?sort=-created_at` (leading `-` = descending).
- Idempotency: `Idempotency-Key` header on `POST` for safe retries (payments, POs).

**Standard error envelope:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Tax ID must be 15 characters.",
    "field": "tax_id",
    "request_id": "req_01HZ..."
  }
}
```

**Status codes:**

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Created |
| 204 | No content (delete / update) |
| 400 | Validation error |
| 401 | Missing/invalid token |
| 403 | Forbidden (RBAC or RLS) |
| 404 | Resource not found |
| 409 | Conflict (duplicate) |
| 422 | Business-rule violation |
| 429 | Rate limited |
| 500 | Internal server error |

---

## 15. Workflows

### 15.1 Vendor Onboarding & Approval
```
Vendor user        Vendor Service        Buyer approver        Audit/Notify
   │                    │                      │                    │
   │── submit profile ─▶│                      │                    │
   │                    │── status=under_review▶│                    │
   │                    │                      │── review docs ─────│
   │                    │                      │── approve ─────────│
   │                    │◀── decision ─────────│                    │
   │                    │── vendor.approved ───────────────────────▶│
   │◀── "Approved" notif│                      │                    │
```
On rejection or return-for-changes, the vendor user is notified with the specific reason; the record re-enters `draft`/`submitted` for correction.

### 15.2 Purchase Order → Invoice → Payment
```
Buyer creates PO ─▶ sent to vendor ─▶ vendor accepts ─▶ goods/services delivered
   │                                                            │
   │◀────── vendor raises invoice against PO ───────────────────┤
   │── finance 3-way match (PO ↔ receipt ↔ invoice) ──▶ matched?
   │        ├─ yes ─▶ approve ─▶ Payment Service ─▶ mark paid ─▶ notify vendor
   │        └─ no  ─▶ dispute / return to vendor
```

### 15.3 Contract Renewal
```
Cron (daily) ─▶ contracts within 30 days of end_date
   ─▶ status = expiring_soon
   ─▶ contract.expiring event ─▶ notify buyer admin
   ─▶ buyer: renew (bump version, new end_date) | terminate
```

---

## 16. Repository Layout (Polyrepo)

The platform is split across **19 git repos** rather than one monorepo. Each micro-service and each UI app is its own repo, so teams can version, test, review, and deploy independently — a broken build in `vms-invoice-service` cannot block `vms-admin-portal`, and each repo scopes its own secrets and branch-protection rules. Shared design-system, typed API client, and Pydantic contracts are **published as versioned packages** (npm + private PyPI) and consumed via pinned dependencies.

| Repo | Kind | Language / runtime | Publishes | CI workflow |
|---|---|---|---|---|
| `vms-auth-service` | Service | Python / FastAPI | image `:3021` | `service-ci.yml` |
| `vms-tenant-service` | Service | Python / FastAPI | image `:3022` | `service-ci.yml` |
| `vms-vendor-service` | Service | Python / FastAPI | image `:3023` | `service-ci.yml` |
| `vms-document-service` | Service | Python / FastAPI | image `:3024` | `service-ci.yml` |
| `vms-contract-service` | Service | Python / FastAPI | image `:3025` | `service-ci.yml` |
| `vms-purchase-order-service` | Service | Python / FastAPI | image `:3026` | `service-ci.yml` |
| `vms-invoice-service` | Service | Python / FastAPI | image `:3027` | `service-ci.yml` |
| `vms-payment-service` | Service | Python / FastAPI | image `:3028` | `service-ci.yml` |
| `vms-performance-service` | Service | Python / FastAPI | image `:3029` | `service-ci.yml` |
| `vms-notification-service` | Service | Python / FastAPI | image `:3030` | `service-ci.yml` |
| `vms-reporting-service` | Service | Python / FastAPI | image `:3031` | `service-ci.yml` |
| `vms-audit-service` | Service | Python / FastAPI | image `:3032` | `service-ci.yml` |
| `vms-admin-portal` | Web app | React 18 / Vite / TS | image `:8080` | `web-ci.yml` |
| `vms-vendor-portal` | Web app | React 18 / Vite / TS | image `:8080` | `web-ci.yml` |
| `vms-ui` | Shared pkg | TS | `@vms/ui` (npm) | `npm-publish.yml` |
| `vms-sdk` | Shared pkg | TS | `@vms/sdk` (npm) | `npm-publish.yml` |
| `vms-contracts` | Shared pkg | Python | `vms-contracts` (PyPI) | `pypi-publish.yml` |
| `vms-infra` | Infra | Nginx / Kong / K8s | manifests + reusable CI workflows | lint + plan |
| `vms-db` | Infra | Alembic / SQL | migrations + seed | `migration-ci.yml` |

- **CI/CD lives as reusable workflows in `vms-infra`** (see §12.1); each app repo only carries a ~10-line caller `ci.yml`.
- **Shared packages** (`@vms/ui`, `@vms/sdk`, `vms-contracts`) are versioned and published; consumers pin a version and bump via Dependabot.

**Representative service repo** — `vms-vendor-service/` (every FastAPI service mirrors this shape):

```
vms-vendor-service/
├── app/
│   ├── main.py                # FastAPI app, mounts on :3023
│   ├── routers/               # /vendors, /vendors/:id, /vendors/:id/approve ...
│   ├── models.py              # SQLAlchemy models (vendors, vendor_users)
│   ├── schemas.py             # Pydantic schemas (re-exports from vms-contracts)
│   └── deps.py                # JWT/tenant extraction, DB session
├── tests/
│   ├── test_vendor_lifecycle.py
│   └── conftest.py
├── Dockerfile                 # multi-stage; arg SERVICE_PORT=3023
├── pyproject.toml             # pins vms-contracts==x.y.z
├── requirements.txt
├── .github/
│   └── workflows/
│       └── ci.yml             # thin caller -> vms-infra/service-ci.yml@v1
└── readme.md
```

**Representative web repo** — `vms-admin-portal/` (both portals share this shape):

```
vms-admin-portal/
├── src/
│   ├── main.tsx
│   ├── pages/                 # /dashboard, /vendors, /invoices ...
│   ├── components/            # imports from @vms/ui
│   └── api/                   # imports from @vms/sdk
├── public/
├── Dockerfile                 # nginx-served static build
├── vite.config.ts
├── package.json               # pins @vms/ui, @vms/sdk
├── .github/
│   └── workflows/
│       └── ci.yml             # thin caller -> vms-infra/web-ci.yml@v1
└── readme.md
```

---

## 17. Non-Functional Requirements

| Attribute | Target |
|---|---|
| Security | RBAC + RLS tenant isolation; TLS 1.3; encryption at rest; MFA for admins; full audit trail |
| Availability | 99.9% uptime (multi-AZ) |
| Performance | Dashboard & key screens < 3 s p95; list endpoints < 800 ms p95 |
| Scalability | Thousands of tenants; millions of vendors + documents; horizontal service autoscaling |
| Auditability | Every state change hash-chained in `audit_logs` |
| Reliability | Graceful degradation; automated failover; daily PITR backups |
| Maintainability | Polyrepo with per-repo lifecycles; shared published packages (`@vms/ui`, `@vms/sdk`, `vms-contracts`); DRY reusable CI workflows |
| Compliance | SOC 2-aligned controls; data residency via Neon region selection |

---

## 18. Future Enhancements

- Electronic signature (DocuSign / eMudhra) for contracts
- AI-based vendor risk scoring & document OCR auto-extraction
- Automatic document-expiry workflows with vendor self-attestation
- AI vendor categorization & duplicate-vendor detection
- ERP / accounting integration (SAP, QuickBooks, Tally)
- OpenSearch-powered vendor & invoice full-text search
- Mobile apps (React Native) for buyer approval-on-the-go and vendor portal
- Marketplace for vendor discovery across tenants (opt-in)

---

## 19. Summary

The Vendor Management System is a **multi-tenant SaaS platform** that lets many buyer companies each manage their own vendors from one shared, securely isolated platform. The design pairs a **secure, data-dense Buyer Admin portal** with a **simple Vendor self-service portal**, both backed by 12 modular FastAPI micro-services behind a Kong gateway. Tenant isolation is enforced at application, database (RLS), and storage layers; data lives in **Neon PostgreSQL** with branch-based migration safety; async events flow through **RabbitMQ** with **Redis Pub/Sub** for real-time UI. The applied UI/UX design system (semantic color tokens, flat-minimal style, tabular figures, AA-contrast) keeps both portals consistent, accessible, and enterprise-grade — turning what was a basic spec into a build-ready engineering reference.
