# Vercel Deployment Setup Guide

## Problem: Dynamic URLs in Vercel Deployments

Vercel generates new URLs for each deployment, which can cause CORS errors and broken API connections. This guide shows you how to handle this properly.

## Solution Options

### Option 1: Use Vercel's Built-in Environment Variables (Recommended)

Vercel automatically provides environment variables that contain the current deployment URL:

- `VERCEL_URL`: The current deployment URL (e.g., `your-app-git-main-wills-projects.vercel.app`)
- `VERCEL_ENV`: The environment (`production`, `preview`, or `development`)

#### Setup Steps:

1. **For the API deployment**, set these environment variables in Vercel:

   ```
   CORS_ORIGIN=https://your-frontend-app.vercel.app
   FRONTEND_URL=https://your-frontend-app.vercel.app
   ```

2. **For the frontend deployment**, set these environment variables:

   ```
   NEXT_PUBLIC_API_DOMAIN=your-api-app.vercel.app
   ```

3. **For preview deployments**, the system will automatically use `VERCEL_URL` to construct the API URL.

### Option 2: Use Custom Domains (Most Stable)

1. **Set up custom domains** for both your frontend and API:

   - Frontend: `https://your-app.com`
   - API: `https://api.your-app.com`

2. **Set environment variables**:

   ```
   # Frontend
   NEXT_PUBLIC_API_URL=https://api.your-app.com/api

   # API
   CORS_ORIGIN=https://your-app.com
   FRONTEND_URL=https://your-app.com
   ```

### Option 3: Manual URL Updates (Not Recommended)

If you need to manually update URLs, you can set:

```
NEXT_PUBLIC_API_URL=https://your-specific-vercel-deployment.vercel.app/api
```

## Environment Variables Reference

### Frontend Environment Variables

| Variable                 | Purpose                   | Example                                       |
| ------------------------ | ------------------------- | --------------------------------------------- |
| `NEXT_PUBLIC_API_URL`    | Explicit API URL override | `https://api.your-app.com/api`                |
| `NEXT_PUBLIC_API_DOMAIN` | API domain for production | `your-api-app.vercel.app`                     |
| `VERCEL_URL`             | Auto-provided by Vercel   | `your-app-git-main-wills-projects.vercel.app` |

### API Environment Variables

| Variable       | Purpose                  | Example                       |
| -------------- | ------------------------ | ----------------------------- |
| `CORS_ORIGIN`  | Frontend domain for CORS | `https://your-app.vercel.app` |
| `FRONTEND_URL` | Frontend domain for CORS | `https://your-app.vercel.app` |

## How the Configuration Works

The `configService` in `app/services/config.ts` resolves the API URL in this priority order:

1. **Explicit override**: `NEXT_PUBLIC_API_URL` (if set)
2. **Vercel preview**: Uses `VERCEL_URL` for preview deployments
3. **Production domain**: Uses `NEXT_PUBLIC_API_DOMAIN` for production
4. **Development fallback**: `http://localhost:3001/api`

## Testing Your Setup

1. **Check configuration** by adding this to your component:

   ```typescript
   import { configService } from "./services/config";

   // In your component
   useEffect(() => {
     configService.logConfig();
   }, []);
   ```

2. **Test API connectivity**:

   ```typescript
   import { brixApi } from "./services/brixApi";

   // Test health check
   brixApi.healthCheck().then(console.log).catch(console.error);
   ```

## Troubleshooting

### CORS Errors

- Check that `CORS_ORIGIN` and `FRONTEND_URL` are set correctly in your API deployment
- Ensure the frontend domain matches exactly (including protocol)

### API Connection Errors

- Verify `NEXT_PUBLIC_API_DOMAIN` is set in your frontend deployment
- Check that the API is deployed and accessible
- Use the health check endpoint: `https://your-api-domain.vercel.app/health`

### Debugging

- Add `configService.logConfig()` to see current configuration
- Check Vercel deployment logs for environment variable issues
- Verify environment variables are set in the correct deployment (frontend vs API)

## Recommended Setup

For the most stable setup:

1. **Use custom domains** for both frontend and API
2. **Set explicit environment variables** rather than relying on auto-detection
3. **Test thoroughly** in preview deployments before going to production
