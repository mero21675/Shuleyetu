# Vercel Deployment Steps

Vercel CLI is installed. Follow these steps to deploy Shuleyetu:

## Step 1: Login to Vercel

```bash
vercel login
```

This will open your browser to authenticate. Sign in with your GitHub account or create a new Vercel account.

## Step 2: Navigate to Project Directory

```bash
cd c:\Users\USER\Documents\Coding\Projects\Shuleyetu\shuleyetu-web
```

## Step 3: Deploy to Production

```bash
vercel --prod
```

This will:
- Link your project to Vercel
- Build the application
- Deploy to production
- Provide you with a live URL

## Step 4: Configure Environment Variables (if needed)

If prompted, add your environment variables:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- SENTRY_DSN
- SENTRY_ORG
- SENTRY_PROJECT
- SENTRY_AUTH_TOKEN
- CLICKPESA_BASE_URL
- CLICKPESA_CLIENT_ID
- CLICKPESA_API_KEY
- CLICKPESA_WEBHOOK_SECRET
- AFRICAS_TALKING_API_KEY
- AFRICAS_TALKING_USERNAME
- CSRF_SECRET

## Step 5: Verify Deployment

Once deployment completes, you'll get a URL like:
```
https://shuleyetu.vercel.app
```

Visit this URL to verify your application is live!

## Troubleshooting

If you encounter issues:

1. **Build fails**: Check that all dependencies are installed
   ```bash
   npm install
   npm run build
   ```

2. **Environment variables not set**: Add them in Vercel dashboard
   - Go to https://vercel.com/dashboard
   - Select your project
   - Settings > Environment Variables
   - Add all required variables

3. **Need to redeploy**:
   ```bash
   vercel --prod --force
   ```

## Next Steps

1. Run the commands above
2. Share your live URL
3. Test all features
4. Set up custom domain (optional)
5. Configure monitoring

---

**Ready to deploy? Run the commands above in your terminal!**
