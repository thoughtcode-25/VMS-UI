# Vendor Management System (VMS) UI

## Author
- Name: Piyush Raj Singh
- Internship Role: MERN STACK DEVELOPMENT
- Company: Trainzex AI

## Project Overview
This repository contains the UI/UX for a Vendor Management System (VMS) portal designed for vendor onboarding, supplier relationship management, document tracking, contract lifecycle, purchase order monitoring, invoicing, payment status, and support workflows.

The platform provides a modern, enterprise-style interface for vendors to manage their business relationship with a company using a clean dashboard, structured forms, tracking panels, and responsive layouts.

## Project Type
- Frontend UI/UX application
- Vendor Portal / Supplier Management Platform
- React + TypeScript + Vite application
- Monorepo workspace with shared client and schema libraries

## Key Features
- Secure vendor login page
- Dashboard with KPI cards and analytics
- Vendor profile and company information management
- Document management and compliance tracking
- Contract lifecycle overview and signing actions
- Purchase order tracking and status updates
- Invoice and payment monitoring
- Support / help center access
- Company directory and vendor organization visibility
- Responsive design for desktop and tablet workflows

## Application Modules
The current app includes these sections:
- Login
- Dashboard
- Profile
- Documents
- Contracts
- Purchase Orders
- Invoices
- Payments
- Support
- Company Directory

## Tech Stack
- React
- TypeScript
- Vite
- Material UI (MUI)
- Tailwind CSS
- Wouter (routing)
- Recharts (charts and analytics)
- pnpm workspaces
- Shared API client libraries inside the monorepo

## Project Structure
```bash
vms_ui/
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
├── README.md
├── vendor-portal/
│   ├── package.json
│   ├── vite.config.ts
│   ├── index.html
│   └── src/
│       ├── App.tsx
│       ├── main.tsx
│       ├── theme.ts
│       ├── components/
│       ├── hooks/
│       ├── lib/
│       └── pages/
├── lib/
│   ├── api-client-react/
│   ├── api-spec/
│   └── api-zod/
├── db/
└── scripts/
```

## Prerequisites
Before running the project, ensure the following are installed:
- Node.js (v18 or later recommended)
- pnpm
- Git

## How to Start the Project
### 1. Clone the repository
```bash
git clone <repository-url>
cd vms_ui
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Start the application
From the root directory:
```bash
pnpm dev
```

This will run the workspace scripts and start the VMS UI app in development mode.

### 4. Open the app
Once the development server is running, open the local URL shown in the terminal, typically:
```bash
http://localhost:5174
```

## Development Notes
- The app is configured to serve on port 5174 by default.
- The frontend includes a route-based vendor portal experience using the Vite dev server.
- The repository currently focuses on the UI/UX and portal experience, while shared API libraries are prepared for backend integration.

## Objective of the Project
This project demonstrates a polished vendor management system user interface with enterprise-level design, modular page structure, and operational workflows that are common in procurement and supplier management systems.

## License
This project is currently configured under the repository's existing license setup. If no separate license is specified, check the repository configuration before public distribution.

## Summary
The VMS UI project is a well-structured, modern, and responsive vendor portal designed for managing vendor relationships, documents, contracts, orders, invoices, and payments. It reflects a professional enterprise dashboard experience and serves as a strong frontend foundation for a full vendor management system.
