# ToyCart Studio - Deployment Guide

Complete deployment guide for ToyCart Studio e-commerce platform.

## 📋 Overview

- **Backend:** PHP + MySQL (Deploy to cPanel)
- **Frontend:** Next.js (Deploy to Render)

## 📚 Documentation Files

1. **DEPLOYMENT_QUICK_START.md** - Quick reference guide (start here!)
2. **DEPLOYMENT_CPANEL.md** - Detailed cPanel backend deployment
3. **DEPLOYMENT_RENDER.md** - Detailed Render frontend deployment
4. **DEPLOYMENT_CHECKLIST.md** - Complete deployment checklist

## 🚀 Quick Start

### Backend (cPanel)
1. Create database in cPanel
2. Import `backend/database/schema.sql` and `insert_products.sql`
3. Upload backend files to `public_html/api/`
4. Update `config.php` and `database.php` with your credentials
5. Set folder permissions (755 for uploads, invoices, logs)

### Frontend (Render)
1. Push code to GitHub
2. Create Web Service on Render
3. Set environment variable: `NEXT_PUBLIC_API_URL=https://yourdomain.com/api`
4. Deploy!

## 📝 Configuration Files

### Backend Production Examples
- `backend/config/config.production.php.example` - Copy to `config.php`
- `backend/config/database.production.php.example` - Copy to `database.php`

### Frontend Environment
- `.env.production.example` - Set in Render environment variables

## 🔧 Important Notes

### cPanel Database Credentials Format
- Database: `cpanelusername_toycart_db`
- User: `cpanelusername_toycart_user`
- Host: `localhost` (usually)

### API URLs
- Backend: `https://yourdomain.com/api`
- Products: `https://yourdomain.com/api/api/products`
- Auth: `https://yourdomain.com/api/api/auth/login`

### CORS Configuration
Update backend CORS to allow your Render frontend URL.

## ✅ Pre-Deployment Checklist

- [ ] Backend code reviewed
- [ ] Test files removed
- [ ] Config files prepared
- [ ] Database schema ready
- [ ] Frontend build tested
- [ ] Environment variables documented

## 🆘 Support

If you face issues:
1. Check the detailed guides in respective files
2. Review deployment checklist
3. Check error logs
4. Verify all configurations

## 📞 Next Steps

1. Read **DEPLOYMENT_QUICK_START.md** for overview
2. Follow **DEPLOYMENT_CPANEL.md** for backend
3. Follow **DEPLOYMENT_RENDER.md** for frontend
4. Use **DEPLOYMENT_CHECKLIST.md** to track progress

Good luck with your deployment! 🎉

