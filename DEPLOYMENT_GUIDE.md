# Deployment Guide - Zoom Timer App

## Prerequisites

- Node.js 16+ and npm
- Zoom developer account
- Zoom desktop client (v5.14.10 or higher)

## Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and update with your Zoom credentials:
```bash
cp .env.example .env
```

### 3. Build the Project
```bash
npm run build
```

### 4. Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Production Deployment

### 1. Build for Production
```bash
npm run build
```

This will create optimized bundle in the `dist/` directory.

### 2. Environment Setup
Create a production `.env` file with:
```
REACT_APP_ENV=production
REACT_APP_API_URL=https://your-production-domain.com
ZOOM_CLIENT_ID=your_production_client_id
ZOOM_APP_INSTANCE_ID=your_production_instance_id
```

### 3. Deployment Options

#### Option A: Deploy to Zoom Marketplace (Recommended)
1. Register the app in Zoom App Marketplace (https://marketplace.zoom.us/)
2. Upload the built files from `dist/` directory
3. Configure the manifest and metadata
4. Submit for review and approval

#### Option B: Self-Hosted Deployment

##### Using Node.js with Express
```bash
npm install express
npm start
```

The server will run on the configured PORT (default 3000).

##### Using Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
COPY public ./public
COPY server.js .
EXPOSE 3000
CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t zoom-timer-app .
docker run -p 3000:3000 zoom-timer-app
```

##### Using Cloud Platforms

**AWS S3 + CloudFront:**
```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name/

# Update CloudFront distribution
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

**Vercel:**
```bash
npm install -g vercel
vercel deploy
```

**Heroku:**
```bash
# Create Procfile
echo "web: node server.js" > Procfile

# Deploy
heroku login
heroku create zoom-timer-app
git push heroku main
```

## Zoom Marketplace Registration

### 1. Create App in Zoom Developer Console
- Visit https://developers.zoom.us/
- Create a new Zoom App
- Select "App Type" as "Zoom Apps"
- Configure the following scopes:
  - `zoomapp:inmeeting`
  - `zoomapp:install`

### 2. Configure App Settings
In the Zoom App developer console:
- **App name**: Zoom Timer App
- **Short description**: Timer and stopwatch for meetings
- **Long description**: (Use content from README.md)
- **App URL**: Your deployed app URL
- **Terms of Service URL**: (Optional)
- **Privacy Policy URL**: (Optional)
- **Support URL**: https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0068677

### 3. Configure Redirect URLs
Add your deployment URL(s) as redirect URLs:
- `https://your-domain.com`
- `https://your-domain.com/callback`

### 4. Set Allowlist
Configure firewall allowlist:
- Add your deployment URL to the Zoom network allowlist
- Example: `https://timer.zoomapp.cloud/`

### 5. Submit for Review
1. Prepare all required assets (icons, screenshots, descriptions)
2. Submit the app for Zoom Marketplace review
3. Wait for approval (typically 2-7 business days)
4. App will be published to Zoom Marketplace

## Verification Checklist

### Before Production:
- [ ] All tests pass (`npm test`)
- [ ] Build completes without errors (`npm run build`)
- [ ] No console errors in development
- [ ] Environment variables are configured
- [ ] SSL certificate is valid (for HTTPS)
- [ ] Zoom SDK is properly initialized
- [ ] Virtual foreground displays correctly
- [ ] Dynamic indicator shows in meetings
- [ ] Keyboard shortcuts work
- [ ] Audio alarm functions
- [ ] App works offline/degraded mode

### After Deployment:
- [ ] App is accessible from the URL
- [ ] Zoom can communicate with the app
- [ ] Virtual foreground renders properly
- [ ] All features work in meetings
- [ ] Performance is acceptable
- [ ] Logs are being captured
- [ ] Monitoring is in place

## Monitoring & Maintenance

### Set Up Logging
```bash
# Using Winston logger
npm install winston
```

### Performance Monitoring
- Monitor bundle size with `webpack-bundle-analyzer`
- Set up error tracking (e.g., Sentry)
- Monitor API response times

### Regular Maintenance
- Keep dependencies updated: `npm update`
- Monitor Zoom SDK changelog for changes
- Test regularly with different Zoom versions
- Maintain user documentation

## Troubleshooting

### App doesn't appear in Zoom
1. Check that the URL is publicly accessible
2. Verify Zoom Client version is 5.14.10+
3. Confirm app is installed in your Zoom account
4. Clear Zoom cache and restart

### Keyboard shortcuts not working
1. Ensure app has focus
2. Check KeyboardShortcutsManager is initialized
3. Verify event listeners are attached

### Virtual foreground not displaying
1. Check Zoom SDK initialization
2. Verify user has video enabled
3. Check image URL is accessible
4. Review browser console for errors

### Timer not syncing with participants
1. Verify `showToAll` toggle is enabled
2. Check `setDynamicIndicator` method is called
3. Ensure all participants are in the same meeting

## Support

For issues:
1. Check the console logs for errors
2. Review the Zoom Apps SDK documentation
3. Contact Zoom developer support
4. File an issue in the project repository

## License

MIT - See LICENSE file for details
