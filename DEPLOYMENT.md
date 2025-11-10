# Deployment Guide: Deploying Live Chatting Website Backend to Render

This guide will walk you through deploying your Node.js/Express backend to Render step by step.

## Prerequisites

1. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, or Bitbucket)
2. **MongoDB Atlas Account**: Free MongoDB database cluster
3. **Render Account**: Free account at [render.com](https://render.com)

---

## Step 1: Prepare Your MongoDB Atlas Database

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account
3. Create a new cluster (choose the FREE M0 tier)

### 1.2 Configure Database Access
1. Go to **Database Access** in the left sidebar
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Create a username and strong password (save these!)
5. Set user privileges to **Read and write to any database**
6. Click **Add User**

### 1.3 Configure Network Access
1. Go to **Network Access** in the left sidebar
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (0.0.0.0/0) - This allows Render to connect
4. Click **Confirm**

### 1.4 Get Connection String
1. Go to **Database** in the left sidebar
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Copy the connection string (it looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)
5. Replace `<username>` and `<password>` with your database user credentials
6. Add your database name at the end: `/livechat?retryWrites=true&w=majority`
7. **Save this connection string** - you'll need it for Render

---

## Step 2: Prepare Your Code for Deployment

### 2.1 Ensure Your Code is in Git
```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit - Ready for deployment"

# Push to GitHub/GitLab/Bitbucket
git remote add origin <your-repository-url>
git push -u origin main
```

### 2.2 Verify package.json
Make sure your `package.json` has a `start` script (it already does):
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

### 2.3 Create .env.example (Optional but Recommended)
Create a `.env.example` file in the Backend folder to document required environment variables:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_jwt_key
PORT=5000
NODE_ENV=production
```

---

## Step 3: Deploy to Render

### 3.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up for a free account (you can use GitHub to sign up)
3. Verify your email address

### 3.2 Create New Web Service
1. Log into your Render dashboard
2. Click **New +** button in the top right
3. Select **Web Service**

### 3.3 Connect Your Repository
1. Click **Connect account** if you haven't connected your Git provider (GitHub/GitLab/Bitbucket)
2. Authorize Render to access your repositories
3. Select your repository from the list
4. Click **Connect**

### 3.4 Configure Your Service

Fill in the following details:

**Name**: `live-chat-backend` (or any name you prefer)

**Region**: Choose the closest region to your users (e.g., `Oregon (US West)`)

**Branch**: `main` (or `master` depending on your default branch)

**Root Directory**: `Backend` (since your server.js is in the Backend folder)

**Environment**: `Node`

**Build Command**: 
```bash
npm install
```

**Start Command**:
```bash
npm start
```

### 3.5 Set Environment Variables

Click on **Advanced** and then **Add Environment Variable**. Add the following:

1. **MONGO_URI**
   - Key: `MONGO_URI`
   - Value: Your MongoDB Atlas connection string (from Step 1.4)
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/livechat?retryWrites=true&w=majority`

2. **JWT_SECRET**
   - Key: `JWT_SECRET`
   - Value: A long, random, secure string
   - You can generate one using:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```
   - Or use an online generator

3. **NODE_ENV**
   - Key: `NODE_ENV`
   - Value: `production`

4. **PORT** (Optional)
   - Key: `PORT`
   - Value: Render will automatically set this, but you can leave it if you want
   - Render automatically assigns a port via `process.env.PORT`

### 3.6 Select Plan
- Choose **Free** plan for testing
- Note: Free tier spins down after 15 minutes of inactivity

### 3.7 Deploy
1. Click **Create Web Service**
2. Render will start building and deploying your application
3. Watch the build logs to ensure everything works correctly
4. The deployment usually takes 2-5 minutes

---

## Step 4: Verify Deployment

### 4.1 Check Build Logs
1. In the Render dashboard, you'll see build logs
2. Look for:
   - ✅ Dependencies installed successfully
   - ✅ Server started successfully
   - ✅ MongoDB connected successfully

### 4.2 Test Your API
Once deployed, you'll get a URL like: `https://live-chat-backend.onrender.com`

Test the health endpoint:
```bash
curl https://live-chat-backend.onrender.com/health
```

Expected response:
```json
{"ok": true}
```

### 4.3 Test Registration Endpoint
```bash
curl -X POST https://live-chat-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test1234"
  }'
```

### 4.4 Test Login Endpoint
```bash
curl -X POST https://live-chat-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test1234"
  }'
```

---

## Step 5: Update CORS Settings (If Needed)

If you're deploying a frontend separately, you may need to update CORS settings in `server.js`:

```javascript
// Allow specific origin
app.use(cors({
  origin: 'https://your-frontend-url.com',
  credentials: true
}));

// Or allow multiple origins
app.use(cors({
  origin: ['https://your-frontend-url.com', 'http://localhost:3000'],
  credentials: true
}));
```

---

## Step 6: Monitor Your Application

### 6.1 View Logs
- Go to your service dashboard on Render
- Click on **Logs** tab to see real-time logs
- Useful for debugging issues

### 6.2 Set Up Alerts (Optional)
- Go to **Settings** → **Alerts**
- Add email alerts for deployment failures

---

## Troubleshooting

### Issue: Build Fails
**Solution**: 
- Check build logs for specific errors
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Issue: Application Crashes on Start
**Solution**:
- Check environment variables are set correctly
- Verify MongoDB connection string is correct
- Check logs for specific error messages

### Issue: MongoDB Connection Failed
**Solution**:
- Verify IP address is whitelisted in MongoDB Atlas (0.0.0.0/0)
- Check username and password in connection string
- Ensure database name is included in connection string

### Issue: CORS Errors
**Solution**:
- Update CORS settings in `server.js` to allow your frontend domain
- Ensure credentials are handled correctly

### Issue: Application Spins Down (Free Tier)
**Solution**:
- Free tier applications spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds (cold start)
- Consider upgrading to a paid plan for always-on service

---

## Updating Your Deployment

Whenever you push changes to your repository:
1. Render automatically detects the changes
2. Triggers a new deployment
3. Builds and deploys the new version
4. Your service URL remains the same

---

## Additional Tips

1. **Custom Domain**: You can add a custom domain in Render settings
2. **Environment Variables**: Keep sensitive data in environment variables, never in code
3. **Database Backups**: Set up automated backups in MongoDB Atlas
4. **Monitoring**: Consider adding application monitoring (e.g., Sentry)
5. **Rate Limiting**: Add rate limiting for production (consider `express-rate-limit`)

---

## Next Steps

1. Deploy your frontend (if you have one)
2. Update frontend API URLs to point to your Render backend
3. Set up CI/CD pipeline for automated deployments
4. Add monitoring and logging
5. Set up database backups

---

## Support

If you encounter issues:
- Check Render documentation: https://render.com/docs
- Check MongoDB Atlas documentation: https://docs.atlas.mongodb.com
- Review application logs in Render dashboard

---

## Summary Checklist

- [ ] MongoDB Atlas account created
- [ ] Database user created
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string obtained and tested
- [ ] Code pushed to Git repository
- [ ] Render account created
- [ ] Web service created on Render
- [ ] Repository connected
- [ ] Environment variables set (MONGO_URI, JWT_SECRET, NODE_ENV)
- [ ] Service deployed successfully
- [ ] Health endpoint tested
- [ ] Registration endpoint tested
- [ ] Login endpoint tested
- [ ] CORS configured (if needed)

Congratulations! Your backend is now deployed on Render! 🎉

