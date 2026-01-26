# Deployment Checklist - ToyCart Studio

## Pre-Deployment

### Backend Preparation
- [ ] Review all code files
- [ ] Remove test files (`test.php`, `test-api.php`, etc.)
- [ ] Remove development scripts (`START_SERVER.bat`, `START_SERVER.sh`)
- [ ] Update `config.php` with production values
- [ ] Update `database.php` with production credentials
- [ ] Generate strong `JWT_SECRET`
- [ ] Test database connection locally
- [ ] Verify all API endpoints work

### Frontend Preparation
- [ ] Test build locally: `npm run build`
- [ ] Verify all environment variables
- [ ] Check API URLs are correct
- [ ] Test all features locally
- [ ] Remove console.logs (optional)
- [ ] Optimize images (optional)

## cPanel Deployment

### Database Setup
- [ ] Create MySQL database in cPanel
- [ ] Create MySQL user in cPanel
- [ ] Grant ALL privileges to user
- [ ] Note down database credentials
- [ ] Import `schema.sql` via phpMyAdmin
- [ ] Import `insert_products.sql` via phpMyAdmin
- [ ] Verify tables created successfully
- [ ] Test database connection

### File Upload
- [ ] Upload backend files to `public_html/api/`
- [ ] Verify all files uploaded correctly
- [ ] Check file structure is correct
- [ ] Upload `vendor` folder (or install via Composer)

### Configuration
- [ ] Update `config.php`:
  - [ ] BASE_URL
  - [ ] API_BASE_URL
  - [ ] Database credentials
  - [ ] JWT_SECRET
  - [ ] Google OAuth (if using)
- [ ] Update `database.php`:
  - [ ] Database name
  - [ ] Database user
  - [ ] Database password
- [ ] Configure `.htaccess` file
- [ ] Set CORS headers in `.htaccess`

### Permissions
- [ ] Set `uploads/` folder to 755 (or 777)
- [ ] Set `invoices/` folder to 755 (or 777)
- [ ] Set `logs/` folder to 755 (or 777)
- [ ] Set PHP files to 644
- [ ] Verify permissions are correct

### Testing
- [ ] Test API endpoint: `/api/api/products`
- [ ] Test database connection
- [ ] Test file uploads
- [ ] Check error logs
- [ ] Verify CORS headers

## Render Deployment

### GitHub Setup
- [ ] Initialize git repository
- [ ] Create `.gitignore` (if not exists)
- [ ] Commit all files
- [ ] Create GitHub repository
- [ ] Push to GitHub
- [ ] Verify all files on GitHub

### Render Configuration
- [ ] Create new Web Service on Render
- [ ] Connect GitHub repository
- [ ] Set build command: `npm install && npm run build`
- [ ] Set start command: `npm start`
- [ ] Add environment variable: `NEXT_PUBLIC_API_URL`
- [ ] Add environment variable: `NODE_ENV=production`
- [ ] Configure auto-deploy
- [ ] Set branch to `main`

### Testing
- [ ] Wait for build to complete
- [ ] Verify build succeeded
- [ ] Test frontend URL
- [ ] Check browser console for errors
- [ ] Test API connection
- [ ] Test login/register
- [ ] Test product browsing
- [ ] Test cart functionality
- [ ] Test checkout process

## Post-Deployment

### Backend
- [ ] Update CORS to allow Render domain
- [ ] Test all API endpoints
- [ ] Verify file uploads work
- [ ] Check invoice generation
- [ ] Test admin panel
- [ ] Monitor error logs
- [ ] Set up SSL/HTTPS (if not auto)

### Frontend
- [ ] Test all pages load
- [ ] Test authentication
- [ ] Test product features
- [ ] Test cart and checkout
- [ ] Test admin panel
- [ ] Check mobile responsiveness
- [ ] Verify images load correctly
- [ ] Test on different browsers

### Security
- [ ] Verify JWT_SECRET is strong
- [ ] Check file permissions
- [ ] Verify .htaccess security rules
- [ ] Test SQL injection protection
- [ ] Verify CORS is properly configured
- [ ] Check for exposed credentials
- [ ] Enable HTTPS/SSL

### Performance
- [ ] Test page load times
- [ ] Check API response times
- [ ] Verify caching works
- [ ] Optimize images (if needed)
- [ ] Monitor resource usage

## Custom Domain (Optional)

### Backend Domain
- [ ] Configure domain in cPanel
- [ ] Update DNS records
- [ ] Update BASE_URL in config.php
- [ ] Test domain access
- [ ] Enable SSL certificate

### Frontend Domain
- [ ] Add custom domain in Render
- [ ] Configure DNS (CNAME)
- [ ] Wait for DNS propagation
- [ ] Update CORS on backend
- [ ] Test domain access
- [ ] Verify SSL certificate

## Monitoring & Maintenance

### Setup
- [ ] Set up error logging
- [ ] Configure uptime monitoring
- [ ] Set up backup schedule
- [ ] Document deployment process
- [ ] Create admin credentials document

### Regular Checks
- [ ] Monitor error logs weekly
- [ ] Check database size
- [ ] Review user activity
- [ ] Update dependencies monthly
- [ ] Backup database regularly

## Troubleshooting

### Common Issues
- [ ] 500 Error → Check permissions, .htaccess, PHP logs
- [ ] CORS Error → Update backend CORS headers
- [ ] Database Error → Verify credentials format
- [ ] Build Fails → Check dependencies, Node version
- [ ] Slow Loading → Check server resources, optimize

### Support Resources
- [ ] cPanel documentation
- [ ] Render documentation
- [ ] PHP error logs
- [ ] Browser console errors
- [ ] Network tab in DevTools

## Final Verification

- [ ] All features working
- [ ] No console errors
- [ ] No API errors
- [ ] Mobile responsive
- [ ] Fast load times
- [ ] Secure (HTTPS)
- [ ] Backups configured
- [ ] Documentation complete

## Notes

- Keep deployment credentials secure
- Document all custom configurations
- Maintain backup of database
- Keep dependencies updated
- Monitor performance regularly

