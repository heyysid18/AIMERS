# Railway Deployment Guide for AIMERS

## Quick Fix for Railway Deployment

### 1. **Environment Variables Setup**
In your Railway project, add these environment variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aimers?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=production
PORT=5000
```

### 2. **Railway Configuration**
- **Root Directory**: Set to `backend`
- **Build Command**: Leave empty (Railway will auto-detect)
- **Start Command**: `npm start`

### 3. **Common Railway Deployment Issues & Solutions**

#### Issue 1: "Build failed"
**Solution**: 
- Make sure your `backend/package.json` has a `start` script
- Check that all dependencies are in `package.json`

#### Issue 2: "MongoDB connection failed"
**Solution**:
- Verify your `MONGODB_URI` is correct
- Make sure your MongoDB cluster allows connections from Railway's IPs
- Test the connection string locally first

#### Issue 3: "Port already in use"
**Solution**:
- Railway automatically sets the `PORT` environment variable
- Your app should use `process.env.PORT || 5000`

#### Issue 4: "CORS errors"
**Solution**:
- The server is now configured to handle both development and production
- Update your frontend to use the Railway URL

### 4. **Step-by-Step Railway Setup**

1. **Go to Railway Dashboard**
   - Visit [railway.app](https://railway.app)
   - Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your AIMERS repository

3. **Configure Project**
   - Set **Root Directory** to `backend`
   - Go to **Variables** tab
   - Add environment variables (see above)

4. **Deploy**
   - Railway will automatically deploy
   - Check the **Deployments** tab for logs

### 5. **Testing Your Deployment**

Once deployed, test these endpoints:
- `https://your-railway-url.railway.app/` (Health check)
- `https://your-railway-url.railway.app/api/auth/register` (Register endpoint)

### 6. **Update Frontend Configuration**

After getting your Railway URL, update your frontend API calls:

```javascript
// In your frontend, change from:
const API_URL = 'http://localhost:5000';

// To:
const API_URL = 'https://your-railway-url.railway.app';
```

### 7. **Troubleshooting Commands**

If deployment fails, check:
1. **Railway Logs**: Go to your project → Deployments → Latest deployment → View logs
2. **Environment Variables**: Verify all required variables are set
3. **MongoDB Connection**: Test your connection string
4. **Port Configuration**: Ensure your app uses `process.env.PORT`

### 8. **Railway-Specific Tips**

- Railway automatically provides HTTPS
- Your app will be available at: `https://your-app-name.railway.app`
- Railway handles SSL certificates automatically
- You can set up custom domains in Railway settings

### 9. **Monitoring**

- Use Railway's built-in monitoring
- Check the **Metrics** tab for performance
- Set up alerts for downtime

### 10. **Common Error Messages**

| Error | Solution |
|-------|----------|
| "Build failed" | Check package.json and dependencies |
| "MongoDB connection failed" | Verify MONGODB_URI and network access |
| "Port already in use" | Use process.env.PORT |
| "CORS error" | Update CORS configuration |
| "JWT_SECRET not found" | Add JWT_SECRET environment variable | 