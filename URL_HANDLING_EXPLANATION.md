# Understanding Dynamic URLs in Vercel

## The Problem

You're right to be confused! Vercel generates new URLs for each deployment, so setting `NEXT_PUBLIC_API_URL` to a hardcoded value doesn't work because it changes every time.

## The Solution

We use **different strategies for different deployment types**:

### 1. Development (Local)

```
API URL: http://localhost:3001/api
```

- Static, never changes
- No environment variables needed

### 2. Preview Deployments (Git branches, PRs)

```
API URL: https://[random-vercel-url].vercel.app/api
```

- Changes every deployment
- **Automatically detected** using `VERCEL_URL` environment variable
- **No manual setup needed**

### 3. Production (Main branch)

```
API URL: https://[stable-domain].vercel.app/api
```

- Should be stable
- **Manually set** using `NEXT_PUBLIC_API_DOMAIN` environment variable

## Environment Variables You Actually Need

### For Frontend Deployment:

```
NEXT_PUBLIC_API_DOMAIN=your-api-app.vercel.app
```

- Only needed for production
- Set this to your stable API domain

### For API Deployment:

```
CORS_ORIGIN=https://your-frontend-app.vercel.app
FRONTEND_URL=https://your-frontend-app.vercel.app
```

- Set these to your frontend domain

## What You DON'T Need to Set

❌ `NEXT_PUBLIC_API_URL` - We don't use this anymore because it changes every deployment

## How It Works

The system automatically detects the environment:

1. **Development**: Uses `http://localhost:3001/api`
2. **Preview**: Uses `https://${VERCEL_URL}/api` (auto-detected)
3. **Production**: Uses `https://${NEXT_PUBLIC_API_DOMAIN}/api` (manually set)

## Example Setup

### Your Vercel Projects:

- Frontend: `soil-dashboard-frontend`
- API: `soil-dashboard-api`

### Environment Variables to Set:

**In Frontend Project:**

```
NEXT_PUBLIC_API_DOMAIN=soil-dashboard-api.vercel.app
```

**In API Project:**

```
CORS_ORIGIN=https://soil-dashboard-frontend.vercel.app
FRONTEND_URL=https://soil-dashboard-frontend.vercel.app
```

## Testing

Add this to your component to see what URL is being used:

```typescript
import { configService } from "./services/config";

useEffect(() => {
  configService.logConfig();
}, []);
```

This will show you exactly which URL is being used and why.
