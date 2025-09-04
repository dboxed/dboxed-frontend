# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `pnpm dev` or `npm run dev`
- **Build for production**: `pnpm build` or `npm run build`
- **Run linting**: `pnpm lint` or `npm run lint`
- **Preview production build**: `pnpm preview` or `npm run preview`
- **Generate API types**: `pnpm generate-types` or `npm run generate-types` - Generates TypeScript types from OpenAPI spec at `http://localhost:5001/openapi.json`

## Architecture Overview

This is a React + TypeScript + Vite frontend application for DBoxed, a container/VM management platform. The app uses a workspace-based multi-tenancy model.

### Core Stack
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite with SWC
- **Styling**: TailwindCSS v4 with Radix UI components
- **State Management**: TanStack Query (React Query)
- **Authentication**: OIDC via `react-oidc-context`
- **API Integration**: OpenAPI-generated client with `openapi-fetch` and `openapi-react-query`
- **Routing**: React Router v7

### Project Structure

#### API Layer (`src/api/`)
- `api.ts`: Core API client setup with authentication headers and React Query integration. Always use this when accessing the API!
- `auth.ts`: OIDC authentication setup and user/admin role checking
- `models/schema.d.ts`: Auto-generated TypeScript types from OpenAPI spec

#### Pages (`src/pages/`)
Resource-based page organization:
- **Base pages** (`base/`): Reusable page templates (BasePage, BaseCreatePage, BaseDetailsPage, etc.)
- **Workspaces**: Dashboard and workspace creation
- **Boxes**: Container/service management with BoxSpec editing
- **Machines**: VM/server management 
- **Machine Providers**: Cloud provider configuration (AWS, Hetzner)
- **Networks**: Network configuration (Netbird)

#### Components (`src/components/`)
- **UI components** (`ui/`): Shadcn/UI components with Radix primitives
- **Layout**: `MainLayout.tsx` with sidebar navigation
- **Shared components**: Confirmation dialogs, breadcrumbs, data tables, etc.

### Key Architectural Patterns

#### Multi-tenancy via Workspaces
- All resources are scoped to workspaces
- URLs follow pattern: `/workspaces/:workspaceId/[resource-type]`
- Workspace selection persists in localStorage via `useSelectedWorkspaceId`

#### Authentication & Authorization  
- OIDC authentication with role-based access (`dboxed-admin` role)
- API requests include Bearer token headers
- `LoginGate` component wraps authenticated routes

#### API Integration
- Type-safe API calls using auto-generated OpenAPI types
- Consistent error handling via TanStack Query
- Event Source support for real-time updates (logs, status)

#### Resource Management Pattern
Each resource type follows consistent patterns:
- List pages with data tables
- Create pages with form validation
- Details pages with tabs/cards for different views
- Base page templates for DRY approach

### Environment Configuration
- Environment variables are handled via `src/env.ts` 
- Supports both build-time (`import.meta.env`) and runtime replacement (`envsubst`)
- Key vars: `VITE_API_URL`, `VITE_OIDC_ISSUER_URL`, `VITE_OIDC_CLIENT_ID`

### Special Features
- **BoxSpec Editor**: YAML/JSON editor for Docker Compose-like configurations with file content editing
- **Log Viewer**: Real-time log streaming via Server-Sent Events
- **Monaco Editor**: Code editing capabilities for configuration files
- **Form Validation**: Zod schemas with React Hook Form integration

When working with this codebase, follow existing patterns for new resources and maintain the workspace-scoped URL structure.

### Very important AI instructions
- Never try to run "npm run dev"