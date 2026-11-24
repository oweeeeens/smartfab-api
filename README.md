# SmartFab API

**SmartFab: Production Monitoring and Equipment Maintenance System** is the backend REST API for a manufacturing plant. It lets the plant:

- register production lines and machines, and track each machine's operating status
- record shift production output, defects and downtime
- report machine issues, assign technicians and track repairs
- manage the spare-parts inventory and record which parts each repair used (stock is deducted automatically)

All routes except login are protected with JWT authentication and role-based access.

## Tech stack

| Component | Technology |
| --- | --- |
| Backend framework | NestJS (TypeScript) |
| ORM | TypeORM |
| Database | MySQL / MariaDB (XAMPP) |
| Authentication | JWT (`@nestjs/jwt`, Passport), bcrypt password hashing |
| Validation | class-validator / class-transformer |
| API testing | Postman |

## Project structure

```
src/
├── main.ts                     # App bootstrap: /api/v1 prefix, validation pipe, error filter
├── app.module.ts               # Root module: config, TypeORM connection, feature modules
├── auth/                       # Login, JWT strategy, auth + role guards
├── users/                      # Users CRUD
├── machines/                   # Machines CRUD (PUT + PATCH)
├── maintenance-requests/       # Issue reporting, technician assignment, status workflow
├── part-usages/                # Parts used per repair (nested under maintenance requests)
├── spare-parts/                # Spare-parts inventory
├── production-logs/            # Shift output / downtime logs
├── production-lines/           # ProductionLine entity
├── maintenance-schedules/      # MaintenanceSchedule entity
├── common/                     # Decorators (@Public, @Roles, @CurrentUser), DTOs, error filter
└── database/                   # Entity list, CHECK constraints, seed script
```

Each feature module follows the same layers: **Controller** (HTTP routes and DTO validation) → **Service** (business rules) → **Repository** (TypeORM entity) → **MySQL**.

## Running locally

### Prerequisites

- Node.js 20 or newer
- MySQL or MariaDB (for example, XAMPP with the MySQL module started)

### Steps

1. Install the dependencies:

   ```bash
   npm install
   ```

2. Create the database. You can use phpMyAdmin, or run:

   ```sql
   CREATE DATABASE smartfab CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. Create your environment file and set your values:

   ```bash
   cp .env.example .env
   ```

   | Variable | Description |
   | --- | --- |
   | `PORT` | API port (default `3000`) |
   | `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME` | MySQL connection |
   | `DB_SYNCHRONIZE` | `true` in development: creates the tables from the entities |
   | `JWT_SECRET` | Long random string used to sign tokens |
   | `JWT_EXPIRES_IN` | Token lifetime, for example `1h` |
   | `SEED_DEFAULT_PASSWORD` | Password given to the demo accounts created by the seed |

4. Create the tables and the demo data:

   ```bash
   npm run seed
   ```

   As an alternative to steps 2 and 4, you can import `database/smartfab.sql` in phpMyAdmin.

5. Start the API:

   ```bash
   npm run start:dev
   ```

   The API runs at `http://localhost:3000/api/v1`.

### Demo accounts (from the seed)

All demo accounts use `SEED_DEFAULT_PASSWORD`.

| Email | Role |
| --- | --- |
| admin@smartfab.com | Admin |
| supervisor@smartfab.com | Supervisor |
| operator@smartfab.com | Operator |
| technician@smartfab.com | Technician |
| manager@smartfab.com | Manager |

## API endpoints

The base URL is `/api/v1`. Every endpoint except login requires the header `Authorization: Bearer <token>`.

| # | Method | Endpoint | Description | Roles |
| --- | --- | --- | --- | --- |
| 1 | POST | `/auth/login` | Log in and receive a JWT | Public |
| 2 | GET | `/auth/profile` | Logged-in user's profile | Any |
| 3 | GET | `/users?role=&page=&limit=` | List users | Admin, Manager, Supervisor |
| 4 | GET | `/users/{id}` | Get one user | Admin, Manager, Supervisor |
| 5 | POST | `/users` | Create a user | Admin |
| 6 | PATCH | `/users/{id}` | Update a user | Admin |
| 7 | DELETE | `/users/{id}` | Delete a user | Admin |
| 8 | GET | `/machines?status=&lineId=&page=&limit=` | List machines | Any |
| 9 | GET | `/machines/{id}` | Get one machine | Any |
| 10 | POST | `/machines` | Register a machine | Admin |
| 11 | PUT | `/machines/{id}` | Replace all machine details | Admin |
| 12 | PATCH | `/machines/{id}` | Update machine status | Admin, Supervisor, Technician |
| 13 | DELETE | `/machines/{id}` | Remove a machine | Admin |
| 14 | GET | `/maintenance-requests?status=&priority=&machineId=&assignedTo=` | List requests | Any |
| 15 | GET | `/maintenance-requests/{id}` | Get one request | Any |
| 16 | POST | `/maintenance-requests` | Report a machine issue | Operator, Supervisor, Admin |
| 17 | PATCH | `/maintenance-requests/{id}` | Assign a technician or update status | Supervisor, Technician, Admin |
| 18 | DELETE | `/maintenance-requests/{id}` | Delete a request | Admin |
| 19 | GET | `/maintenance-requests/{id}/part-usages` | Parts used in a repair | Any |
| 20 | POST | `/maintenance-requests/{id}/part-usages` | Record a part used (deducts stock) | Technician, Supervisor, Admin |
| 21 | GET | `/spare-parts?lowStock=&page=&limit=` | List spare parts | Any |
| 22 | GET | `/spare-parts/{id}` | Get one spare part | Any |
| 23 | POST | `/spare-parts` | Add a spare part | Admin, Supervisor |
| 24 | PATCH | `/spare-parts/{id}` | Update or restock a part | Admin, Supervisor |
| 25 | DELETE | `/spare-parts/{id}` | Delete a spare part | Admin |
| 26 | GET | `/production-logs?machineId=&operatorId=&shiftDate=&shift=` | List production logs | Any |
| 27 | GET | `/production-logs/{id}` | Get one log | Any |
| 28 | POST | `/production-logs` | Submit a shift log | Operator |
| 29 | PATCH | `/production-logs/{id}` | Correct a log (operators can edit only their own) | Operator, Supervisor, Admin |
| 30 | DELETE | `/production-logs/{id}` | Delete a log | Supervisor, Admin |

### Status codes

| Code | Meaning |
| --- | --- |
| `200` | OK |
| `201` | Created |
| `204` | Deleted (no content) |
| `400` | Validation failed or a business rule was broken |
| `401` | Token missing, invalid or expired |
| `403` | Role not allowed |
| `404` | Resource not found |
| `409` | Duplicate value, or the record is still referenced by other data |

### Error format

Every error uses the same body:

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Resource not found.",
  "errors": ["No machine exists with ID 99."],
  "timestamp": "2026-10-24T08:00:00.000Z",
  "path": "/api/v1/machines/99"
}
```

## Testing with Postman

Import `postman/SmartFab.postman_collection.json`. Run the **Auth** folder first: it logs in each demo role and saves the tokens into collection variables.

On a freshly seeded database, you can run the whole collection from top to bottom with the Collection Runner. Every request has a test that checks the expected status code.

## Database

The schema follows the Lab 04 ERD and Data Dictionary. It has 8 tables: User, ProductionLine, Machine, ProductionLog, MaintenanceRequest, MaintenanceSchedule, SparePart and PartUsage. They are linked by primary and foreign keys, and the database enforces CHECK constraints such as allowed roles and statuses and non-negative stock.

`database/smartfab.sql` is a full export (schema and demo data).

On Windows, MySQL stores table names in lowercase (`lower_case_table_names=1`), so the entities use lowercase table names. Column names keep the PascalCase from the Data Dictionary.
