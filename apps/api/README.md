# Drivn API

Node.js/Express backend for the Drivn car rental platform.

## Tech Stack

- **Runtime:** Node.js v22+
- **Framework:** Express 5
- **Database:** MongoDB via Mongoose
- **Validation:** Zod
- **Testing:** Vitest + Supertest
- **Linting:** oxlint + oxfmt
- **Build:** tsdown

## Project Structure

```
src/
├── config/
│   └── env.ts          # Environment variable validation (Zod schema)
├── errors/
│   └── http.exception.ts  # Custom HTTP exception classes
├── lib/
│   └── handler.ts      # Async route handler wrapper with standardized responses
├── middleware/
│   └── error.middleware.ts  # Global error handler
├── app.ts              # Express app factory
└── server.ts           # Entry point (DB connect + listen)
```

## Getting Started

### Prerequisites

- Node.js v22+
- MongoDB (run via `docker-compose up -d` from repo root)
- Environment variables set (see `.env.example` at repo root)

### Run

```bash
# From repo root (recommended)
pnpm dev:api

# Or from this directory
pnpm dev
```

The server starts on `http://localhost:3000` by default.

### Environment Variables

Loaded from `.env.development` at repo root. Required variables:

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `MONGODB_URI` | URL | - | MongoDB connection string |
| `MONGODB_DBNAME` | string | `drivn-dev` | Database name |
| `PORT` | number | `3000` | Server port |
| `BETTER_AUTH_URL` | URL | `http://localhost:3000` | Better Auth server base URL |
| `BETTER_AUTH_SECRET` | string (min 32) | - | Better Auth secret for signing tokens |
| `NODE_ENV` | `development` \| `production` \| `test` | `development` | Environment |

## API Conventions

### Route Handlers

Use the `handler` wrapper for all route handlers. It standardizes responses and handles errors automatically.

```ts
import { handler } from './lib/handler.js';

// Return raw data → { success: true, data: ... }
router.get('/items', handler(async (req, res) => {
  return await Item.find();
}));

// Return structured response with status code
router.post('/items', handler(async (req, res) => {
  const item = await Item.create(req.body);
  return { data: item, message: 'Created', statusCode: 201 };
}));
```

### Error Handling

Throw `HttpException` subclasses for error responses:

```ts
import { NotFoundException, BadRequestException, ValidationException } from '../errors/http.exception.js';

throw new NotFoundException('Item not found');
throw new BadRequestException('Invalid input');
throw new ValidationException(zodFieldErrors); // from Zod parsing
```

Available exceptions: `BadRequestException`, `UnauthorizedException`, `ForbiddenException`, `NotFoundException`, `ConflictException`, `ValidationException`, `TooManyRequestsException`, `InternalServerErrorException`, `ServiceUnavailableException`.

### Response Format

```json
// Success
{ "success": true, "data": "...", "message": "...", "meta": "..." }

// Error
{ "success": false, "status": 404, "code": "NOT_FOUND", "message": "..." }
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server with hot reload |
| `pnpm build` | Build for production |
| `pnpm test` | Run tests |
| `pnpm lint` | Lint with oxlint |
| `pnpm format` | Format with oxfmt |
