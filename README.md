# Insighta Demographic Intelligence API

A NestJS REST API that serves demographic profile data with advanced filtering, sorting, pagination, and natural language search.

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: NestJS
- **Database**: SQLite (via TypeORM + better-sqlite3)
- **Validation**: class-validator + class-transformer
- **IDs**: UUID v7 (time-sortable, globally unique)

## Setup

```bash
# Install dependencies
npm install

# Seed the database (2026 profiles)
npm run seed

# Start the server
npm run start:dev
```

The API runs on `http://localhost:3000`.

## Endpoints

### `GET /api/profiles`

Browse profiles with filtering, sorting, and pagination.

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `gender` | `male` \| `female` | Filter by gender |
| `age_group` | `child` \| `teenager` \| `adult` \| `senior` | Filter by age group |
| `country_id` | string | Filter by 2-letter ISO country code |
| `min_age` | integer | Minimum age (inclusive) |
| `max_age` | integer | Maximum age (inclusive) |
| `min_gender_probability` | float (0-1) | Minimum gender confidence |
| `min_country_probability` | float (0-1) | Minimum country confidence |
| `sort_by` | `age` \| `created_at` \| `gender_probability` | Sort field |
| `order` | `asc` \| `desc` | Sort direction (default: desc) |
| `page` | integer | Page number (default: 1) |
| `limit` | integer | Results per page (default: 20, max: 100) |

**Example:**
```
GET /api/profiles?gender=female&min_age=25&sort_by=age&order=asc&page=1&limit=10
```

### `GET /api/profiles/search?q=`

Natural language search that translates human queries into structured filters.

**Examples:**

| Query | Interpreted As |
|-------|---------------|
| `young males` | gender=male, age 16-24 |
| `females above 30` | gender=female, min_age=30 |
| `people from angola` | country_id=AO |
| `adult males from kenya` | gender=male, age_group=adult, country_id=KE |
| `male and female teenagers above 17` | age_group=teenager, min_age=17 |

## Natural Language Parser

### Approach

The parser uses **rule-based keyword matching** — no AI involved. It works in this order:

1. Lowercase and trim the input
2. Scan for gender keywords (`male`, `males`, `female`, `females`)
3. Scan for age group keywords (`adult`, `teenager`, `teen`, `senior`, `child`, `kids`)
4. Check for the `young` keyword (maps to age 16-24 per spec)
5. Check for age range patterns (`above N`, `below N`, `between N and N`)
6. Check for country names against a hardcoded country map (sorted longest-first to avoid partial matches)

If at least one keyword matches, the parser returns a structured filter object. If nothing matches, it returns an error.

### Limitations

- **No typo correction** — "mael" won't match "male"
- **No synonyms beyond basics** — "guys" won't match "males"
- **Country list is hardcoded** — uncommon countries may be missing
- **Word order doesn't matter** — "males young" works the same as "young males"
- **No negation** — "not male" isn't supported
- **"young" is strictly 16-24** — no flexibility in this range

## Error Handling

All errors follow the format:
```json
{
  "status": "error",
  "message": "Description of what went wrong"
}
```

## Database Design

- **Primary key**: UUID v7 (time-sortable for better index performance)
- **Indexes**: on `gender`, `age`, `age_group`, `country_id` to avoid full table scans
- **Unique constraint**: on `name` to support idempotent seeding

## Seed Idempotency

Running `npm run seed` multiple times is safe — it checks each profile by name:
- If the name doesn't exist → insert with a new UUID v7
- If the name already exists → update the existing record

## Project Structure

```
src/
├── main.ts                          # App entry point (CORS, validation)
├── app.module.ts                    # Root module (TypeORM + SQLite config)
├── filters/
│   └── http-error.filter.ts         # Custom error response format
├── profiles/
│   ├── profile.module.ts            # Feature module
│   ├── profile.controller.ts        # HTTP routes
│   ├── profile.service.ts           # Query building + business logic
│   ├── dto/
│   │   └── filter-profile.dto.ts    # Input validation rules
│   ├── entities/
│   │   └── profile.entity.ts        # Database table schema
│   └── utils/
│       └── query-parser.ts          # Natural language → filter object
├── seed/
│   └── seed.ts                      # Database seeding script
└── data/
    └── profiles.json                # 2026 seed profiles
```
