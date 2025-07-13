# Fundacite Carabobo Registration System

## Overview

This is a full-stack web application for Fundacite Carabobo that allows students to register for technology courses and guided tours. The system features a React frontend with a modern UI built using shadcn/ui components, an Express.js backend API, and in-memory storage for development. The center operates from 8:00 AM to 1:00 PM, Monday through Friday only.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and building
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **API**: RESTful API design with JSON responses
- **Session Management**: Express sessions with PostgreSQL session store

### Project Structure
```
├── client/          # React frontend
├── server/          # Express backend
├── shared/          # Shared TypeScript types and schemas
└── migrations/      # Database migration files
```

## Key Components

### Database Schema
Located in `shared/schema.ts`, defines five main entities:
- **Users**: Authentication and user management
- **Courses**: Swimming courses with capacity and scheduling
- **Tours**: Different types of facility tours (weekday, Saturday, Sunday)
- **Course Registrations**: Student registrations for courses
- **Tour Registrations**: Visitor registrations for tours

### Frontend Components
- **Home Page**: Main interface with tabbed navigation (courses, tours, admin)
- **Course Registration Modal**: Form for course sign-ups
- **Admin Panel**: Management interface for viewing and updating registrations
- **UI Components**: Comprehensive set of reusable components from shadcn/ui

### Backend API Endpoints
- `GET /api/courses` - Fetch all courses
- `GET /api/courses/:id` - Fetch specific course
- `GET /api/tours` - Fetch all tours
- `GET /api/course-registrations` - Fetch all course registrations
- `GET /api/tour-registrations` - Fetch all tour registrations
- `POST` endpoints for creating new registrations
- `PATCH` endpoints for updating registration status

## Data Flow

1. **Client Requests**: React components use TanStack Query to fetch data from API endpoints
2. **API Processing**: Express routes handle requests and interact with the database via Drizzle ORM
3. **Database Operations**: Drizzle provides type-safe queries to PostgreSQL
4. **Response Handling**: API responses are cached and managed by React Query
5. **UI Updates**: Components automatically re-render when data changes

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React, React DOM, React Hook Form
- **Backend**: Express.js, Drizzle ORM, Neon PostgreSQL client
- **Validation**: Zod for runtime type checking
- **UI**: Radix UI primitives, Tailwind CSS, Lucide icons

### Development Tools
- **TypeScript**: Full type safety across the stack
- **Vite**: Fast development server and build tool
- **ESBuild**: Production bundling for the backend
- **PostCSS**: CSS processing with Tailwind

### Database
- **Neon PostgreSQL**: Serverless PostgreSQL database
- **Drizzle Kit**: Database migrations and schema management

## Deployment Strategy

### Development
- Frontend: Vite dev server with HMR
- Backend: Node.js with tsx for TypeScript execution
- Database: PostgreSQL connection via environment variables

### Production Build
- Frontend: Built to `dist/public` directory for static serving
- Backend: Bundled with ESBuild to `dist/index.js`
- Database: Migrations applied via Drizzle Kit

### Environment Configuration
- Database URL configured via `DATABASE_URL` environment variable
- Development/production modes controlled by `NODE_ENV`
- Replit-specific configurations for cloud deployment

The architecture emphasizes type safety, modern development practices, and a clean separation between frontend and backend concerns while sharing common types and validation schemas.

## Recent Changes

### January 2025
- **Course Management System**: Added complete CRUD functionality for managing courses from admin panel
  - New "Gestión de Cursos" tab in admin panel with full create, edit, delete operations
  - Form validation with Zod schemas and real-time updates
  - API endpoints: POST /api/courses, PATCH /api/courses/:id, DELETE /api/courses/:id
- **Social Media Integration**: Added comprehensive footer with social media links
  - Facebook, Instagram, Twitter, YouTube, and LinkedIn links for Fundacite Carabobo
  - Contact information including email, phone, and address
  - Operating hours display and responsive design with hover effects
  - Added react-icons dependency for social media icons