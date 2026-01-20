# Shuleyetu Free Deployment Guide

Deploy Shuleyetu to production for FREE using these platforms.

---

## Option 1: Vercel (Recommended for Next.js)

### Free Tier Includes
- Unlimited deployments
- Automatic HTTPS
- Global CDN
- Serverless functions
- 100GB bandwidth/month
- Automatic scaling

### Deployment Steps

1. **Create Vercel Account**
   ```bash
   # Visit https://vercel.com/signup
   # Sign up with GitHub
   ```

2. **Connect Repository**
   ```bash
   # In Vercel dashboard, click "New Project"
   # Select your GitHub repository
   # Select "shuleyetu-web" as root directory
   ```

3. **Configure Environment Variables**
   ```
   In Vercel Dashboard > Settings > Environment Variables, add:
   
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   SENTRY_DSN=your-sentry-dsn
   SENTRY_ORG=your-org
   SENTRY_PROJECT=your-project
   SENTRY_AUTH_TOKEN=your-token
   CLICKPESA_BASE_URL=https://api.clickpesa.com
   CLICKPESA_CLIENT_ID=your-client-id
   CLICKPESA_API_KEY=your-api-key
   CLICKPESA_WEBHOOK_SECRET=your-webhook-secret
   AFRICAS_TALKING_API_KEY=your-api-key
   AFRICAS_TALKING_USERNAME=your-username
   CSRF_SECRET=your-csrf-secret
   ```

4. **Deploy**
   ```bash
   # Click "Deploy"
   # Wait for build to complete
   # Your app is live at https://shuleyetu.vercel.app
   ```

5. **Custom Domain (Optional)**
   ```bash
   # In Vercel Dashboard > Settings > Domains
   # Add your custom domain
   # Update DNS records as instructed
   ```

---

## Option 2: Netlify

### Free Tier Includes
- 300 build minutes/month
- Unlimited deployments
- Automatic HTTPS
- Global CDN
- 100GB bandwidth/month

### Deployment Steps

1. **Create Netlify Account**
   ```bash
   # Visit https://app.netlify.com/signup
   # Sign up with GitHub
   ```

2. **Connect Repository**
   ```bash
   # Click "New site from Git"
   # Select GitHub
   # Choose your repository
   # Select "shuleyetu-web" as base directory
   ```

3. **Configure Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

4. **Set Environment Variables**
   ```bash
   # In Netlify Dashboard > Site settings > Build & deploy > Environment
   # Add all environment variables from above
   ```

5. **Deploy**
   ```bash
   # Click "Deploy site"
   # Wait for build to complete
   # Your app is live at https://your-site-name.netlify.app
   ```

---

## Option 3: Railway (Alternative)

### Free Tier Includes
- $5/month free credits
- Automatic deployments
- Global edge network
- PostgreSQL database included

### Deployment Steps

1. **Create Railway Account**
   ```bash
   # Visit https://railway.app
   # Sign up with GitHub
   ```

2. **Create New Project**
   ```bash
   # Click "New Project"
   # Select "Deploy from GitHub repo"
   # Choose your repository
   ```

3. **Configure**
   ```bash
   # Add environment variables
   # Set build command: npm run build
   # Set start command: npm start
   ```

4. **Deploy**
   ```bash
   # Railway automatically deploys on push
   # Your app is live at https://your-app.railway.app
   ```

---

## Option 4: Render

### Free Tier Includes
- Automatic deployments
- HTTPS
- Global CDN
- PostgreSQL database
- 750 hours/month compute

### Deployment Steps

1. **Create Render Account**
   ```bash
   # Visit https://render.com
   # Sign up with GitHub
   ```

2. **Create Web Service**
   ```bash
   # Click "New +"
   # Select "Web Service"
   # Connect GitHub repository
   ```

3. **Configure**
   ```
   Build command: npm run build
   Start command: npm start
   Root directory: shuleyetu-web
   ```

4. **Add Environment Variables**
   ```bash
   # In Render Dashboard > Environment
   # Add all required variables
   ```

5. **Deploy**
   ```bash
   # Click "Create Web Service"
   # Wait for deployment
   # Your app is live at https://your-app.onrender.com
   ```

---

## Database Setup (Supabase Free Tier)

### Create Supabase Project

1. **Sign Up**
   ```bash
   # Visit https://supabase.com
   # Click "Start your project"
   # Sign up with GitHub
   ```

2. **Create Organization**
   ```bash
   # Enter organization name
   # Create new project
   ```

3. **Configure Database**
   ```bash
   # Wait for database to initialize
   # Copy connection string
   # Add to environment variables
   ```

4. **Apply Migrations**
   ```bash
   # In Supabase Dashboard > SQL Editor
   # Run migration files from supabase/migrations/
   # Or use Supabase CLI:
   supabase migration up
   ```

---

## Recommended Setup (Free Tier)

### Best Free Combination
1. **Frontend**: Vercel (Next.js optimized)
2. **Database**: Supabase (PostgreSQL)
3. **Error Tracking**: Sentry (free tier)
4. **Monitoring**: Uptime Robot (free tier)

### Total Cost: $0/month

---

## Quick Start Commands

### Deploy to Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
cd shuleyetu-web
vercel --prod

# Your app is live!
```

### Deploy to Netlify CLI

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login to Netlify
netlify login

# Deploy
cd shuleyetu-web
netlify deploy --prod

# Your app is live!
```

---

## Post-Deployment Checklist

- [ ] App deployed successfully
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Health check endpoint working
- [ ] Status page accessible
- [ ] Sentry receiving errors
- [ ] Uptime monitoring active
- [ ] Custom domain configured (optional)
- [ ] SSL certificate valid
- [ ] Performance acceptable

---

## Monitoring Free Services

### Uptime Monitoring
- **UptimeRobot** (free tier): https://uptimerobot.com
- **Pingdom** (free tier): https://www.pingdom.com
- **StatusPage.io** (free tier): https://www.statuspage.io

### Error Tracking
- **Sentry** (free tier): https://sentry.io
- **Rollbar** (free tier): https://rollbar.com

### Performance Monitoring
- **Vercel Analytics** (included with Vercel)
- **Netlify Analytics** (included with Netlify)

---

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variables Not Working
- Verify variables are set in deployment platform
- Restart deployment after adding variables
- Check variable names match exactly

### Database Connection Issues
- Verify Supabase credentials
- Check RLS policies
- Test connection locally first

### Performance Issues
- Check bundle size: `npm run build`
- Review Sentry for errors
- Monitor database queries

---

## Next Steps

1. Choose deployment platform (Vercel recommended)
2. Set up Supabase database
3. Deploy application
4. Configure monitoring
5. Test all features
6. Share with users

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Supabase Docs**: https://supabase.com/docs
- **Sentry Docs**: https://docs.sentry.io

---

**Ready to deploy? Choose your platform and follow the steps above!**
