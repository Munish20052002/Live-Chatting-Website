# Render Deployment Quick Checklist

Use this checklist to ensure a smooth deployment to Render.

## Pre-Deployment Checklist

### ✅ MongoDB Atlas Setup
- [ ] MongoDB Atlas account created
- [ ] Free cluster (M0) created
- [ ] Database user created (username & password saved)
- [ ] Network Access configured (0.0.0.0/0 - Allow from anywhere)
- [ ] Connection string obtained and tested locally
- [ ] Connection string format: `mongodb+srv://username:password@cluster.xxxxx.mongodb.net/livechat?retryWrites=true&w=majority`

### ✅ Code Preparation
- [ ] Code pushed to GitHub/GitLab/Bitbucket
- [ ] `.gitignore` file created (excludes `.env` and `node_modules`)
- [ ] `package.json` has `start` script: `"start": "node server.js"`
- [ ] All dependencies listed in `package.json`
- [ ] No hardcoded secrets or API keys in code
- [ ] Server uses `process.env.PORT` (Render sets this automatically)

### ✅ Environment Variables Prepared
- [ ] `MONGO_URI` - MongoDB Atlas connection string
- [ ] `JWT_SECRET` - Secure random string (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- [ ] `NODE_ENV` - Set to `production`
- [ ] `FRONTEND_URL` - Your frontend URL (optional, for CORS)

## Render Setup Checklist

### ✅ Render Account
- [ ] Render account created
- [ ] Git provider (GitHub/GitLab) connected to Render

### ✅ Web Service Configuration
- [ ] New Web Service created
- [ ] Repository connected
- [ ] **Root Directory**: `Backend` (important!)
- [ ] **Environment**: `Node`
- [ ] **Build Command**: `npm install`
- [ ] **Start Command**: `npm start`
- [ ] **Plan**: Free (for testing) or Paid (for production)

### ✅ Environment Variables in Render
- [ ] `MONGO_URI` added
- [ ] `JWT_SECRET` added
- [ ] `NODE_ENV` set to `production`
- [ ] `FRONTEND_URL` added (if you have a frontend)

## Post-Deployment Verification

### ✅ Deployment Success
- [ ] Build completed successfully (check logs)
- [ ] Service is "Live" (green status)
- [ ] No errors in build logs
- [ ] MongoDB connection successful in logs

### ✅ API Testing
- [ ] Health check works: `GET /health`
- [ ] Registration works: `POST /api/auth/register`
- [ ] Login works: `POST /api/auth/login`
- [ ] Get user works: `GET /api/users/me` (with token)

### ✅ Security Check
- [ ] Environment variables are set (not in code)
- [ ] CORS configured correctly
- [ ] JWT tokens are working
- [ ] Passwords are hashed (not plain text)

## Common Issues & Solutions

### ❌ Build Fails
- Check build logs for specific errors
- Verify all dependencies in `package.json`
- Check Node.js version compatibility

### ❌ Application Crashes
- Check environment variables are set correctly
- Verify MongoDB connection string format
- Check application logs for errors

### ❌ MongoDB Connection Failed
- Verify IP is whitelisted (0.0.0.0/0)
- Check username/password in connection string
- Ensure database name is in connection string

### ❌ CORS Errors
- Set `FRONTEND_URL` environment variable
- Update CORS settings in `server.js`
- Check browser console for specific errors

## Quick Commands

### Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Test Health Endpoint
```bash
curl https://your-app.onrender.com/health
```

### Test Registration
```bash
curl -X POST https://your-app.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test1234"}'
```

### Test Login
```bash
curl -X POST https://your-app.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test1234"}'
```

## Render URLs

After deployment, your API will be available at:
- Production URL: `https://your-app-name.onrender.com`
- Health Check: `https://your-app-name.onrender.com/health`
- API Base: `https://your-app-name.onrender.com/api`

## Next Steps After Deployment

1. [ ] Update frontend to use production API URL
2. [ ] Set up custom domain (optional)
3. [ ] Configure monitoring and alerts
4. [ ] Set up database backups
5. [ ] Add rate limiting for production
6. [ ] Set up CI/CD for automated deployments

## Support Resources

- Render Documentation: https://render.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- Render Status: https://status.render.com

---

**🎉 Once all items are checked, your backend is ready for production!**

