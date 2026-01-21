# Visual Life Execution System - Backend

This directory contains the backend services for the application.

## 🛠 Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Cache:** Redis (planned)

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

3. **Start Database:**
   From the project root:
   ```bash
   docker-compose up -d postgres redis
   ```

4. **Run Migrations:**
   ```bash
   npx prisma db push
   ```

5. **Start Development Server:**
   ```bash
   npm run dev
   ```

## 📁 Structure

- `src/index.ts`: Entry point
- `src/routes`: API routes
- `src/controllers`: Request handlers
- `src/middleware`: Express middleware
- `prisma/schema.prisma`: Database schema
