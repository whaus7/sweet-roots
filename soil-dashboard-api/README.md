# Soil Dashboard API

Backend API for the Soil Dashboard Brix Logs feature, built with Express.js and PostgreSQL.

## Features

- **Brix Readings Management**: CRUD operations for plant Brix readings
- **Plant Reference Data**: Comprehensive database of garden plants with healthy Brix ranges
- **Statistics**: Analytics and insights from Brix readings
- **RESTful API**: Clean, documented endpoints
- **PostgreSQL Database**: Robust data storage with proper constraints

## Setup

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database (local or cloud)
- npm or yarn

### Installation

1. **Install dependencies**:

   ```bash
   cd api
   npm install
   ```

2. **Environment Configuration**:

   ```bash
   cp env.example .env
   ```

   Edit `.env` with your database credentials:

   ```env
   DATABASE_URL=postgresql://username:password@host:port/database
   PORT=3001
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

3. **Database Setup**:
   The API will automatically create the necessary tables and populate plant reference data on first run.

4. **Start the server**:

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Health Check

- `GET /health` - Server health status

### Brix Readings

#### Get All Readings

- `GET /api/brix/readings`
- Query Parameters:
  - `plant_name` (optional): Filter by plant name
  - `limit` (optional): Number of results (default: 100)
  - `offset` (optional): Pagination offset (default: 0)

#### Get Specific Reading

- `GET /api/brix/readings/:id`

#### Create New Reading

- `POST /api/brix/readings`
- Body:
  ```json
  {
    "plant_name": "Spinach",
    "brix_value": 8.5,
    "reading_date": "2024-01-15",
    "notes": "Morning reading, good conditions"
  }
  ```

#### Update Reading

- `PUT /api/brix/readings/:id`
- Body: Same as POST (all fields optional)

#### Delete Reading

- `DELETE /api/brix/readings/:id`

### Plant Reference

#### Get All Plants

- `GET /api/brix/plants`

#### Get Specific Plant

- `GET /api/brix/plants/:name`

### Statistics

#### Get Reading Statistics

- `GET /api/brix/stats`
- Query Parameters:
  - `plant_name` (optional): Filter by plant name

## Database Schema

### brix_readings

| Column       | Type         | Constraints    |
| ------------ | ------------ | -------------- |
| id           | UUID         | PRIMARY KEY    |
| plant_name   | VARCHAR(100) | NOT NULL       |
| brix_value   | DECIMAL(4,1) | NOT NULL, 0-30 |
| reading_date | DATE         | NOT NULL       |
| notes        | TEXT         | NULL           |
| created_at   | TIMESTAMP    | DEFAULT NOW    |
| updated_at   | TIMESTAMP    | DEFAULT NOW    |

### plant_reference

| Column           | Type         | Constraints      |
| ---------------- | ------------ | ---------------- |
| id               | UUID         | PRIMARY KEY      |
| plant_name       | VARCHAR(100) | UNIQUE, NOT NULL |
| category         | VARCHAR(50)  | NOT NULL         |
| healthy_brix_min | DECIMAL(4,1) | NOT NULL         |
| healthy_brix_max | DECIMAL(4,1) | NOT NULL         |
| description      | TEXT         | NULL             |
| created_at       | TIMESTAMP    | DEFAULT NOW      |

## Plant Categories

The API includes comprehensive plant data across these categories:

- **Leafy Greens**: Spinach, Kale, Lettuce, Arugula, Swiss Chard, Collard Greens
- **Brassicas**: Broccoli, Cauliflower, Cabbage, Brussels Sprouts
- **Root Vegetables**: Carrots, Beets, Radishes, Turnips, Parsnips
- **Nightshades**: Tomatoes, Bell Peppers, Eggplant, Potatoes
- **Legumes**: Green Beans, Peas, Snap Peas
- **Alliums**: Onions, Garlic, Leeks
- **Cucurbits**: Cucumbers, Zucchini, Winter Squash, Pumpkins
- **Herbs**: Basil, Parsley, Cilantro, Mint
- **Microgreens**: Sunflower, Pea Shoots, Radish, Broccoli Microgreens

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message"
}
```

## Development

### Running in Development

```bash
npm run dev
```

### Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (development/production)
- `CORS_ORIGIN`: Allowed CORS origin

### Database Connection

The API uses the `pg` library for PostgreSQL connections with automatic SSL configuration for production environments.

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure `DATABASE_URL` with your production database
3. Set appropriate `CORS_ORIGIN` for your frontend domain
4. Use a process manager like PM2 or deploy to a cloud platform

## API Response Format

All successful responses follow this format:

```json
{
  "success": true,
  "data": [...],
  "count": 10
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License
