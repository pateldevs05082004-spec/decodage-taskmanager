# Decode Age Task Manager

A web-based task management application with role-based access control and real-time updates.

## Project Structure

This is a monorepo containing:
- `frontend/` - React + TypeScript frontend application
- `backend/` - Node.js + Express backend API

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Microsoft Entra ID (Azure AD) application registration

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment files and fill in your values:

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env
```

### 3. Set Up Database

Create a PostgreSQL database and run migrations (instructions coming in task 1.2).

### 4. Configure Microsoft Entra ID

Follow the instructions in task 1.4 to set up your Entra ID application.

### 5. Run Development Servers

```bash
# Run both frontend and backend
npm run dev

# Or run individually
npm run dev:frontend
npm run dev:backend
```

The frontend will be available at http://localhost:3000 and the backend at http://localhost:5000.

## Available Scripts

- `npm run dev` - Run both frontend and backend in development mode
- `npm run build` - Build both workspaces for production
- `npm run test` - Run tests in all workspaces
- `npm run lint` - Lint all workspaces
- `npm run format` - Format code with Prettier

## Technology Stack

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- Vitest + React Testing Library

### Backend
- Node.js
- Express
- TypeScript
- PostgreSQL
- WebSocket (ws)
- Vitest

### Development Tools
- ESLint
- Prettier
- fast-check (property-based testing)

## License

Private - Decode Age
