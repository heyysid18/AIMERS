# AIMERS Project Deployment Guide

## Overview
This project consists of a React frontend and Node.js/Express backend. This guide will help you deploy both parts of the application.

## Frontend Deployment (GitHub Pages)

The frontend is configured to deploy automatically to GitHub Pages when you push to the master branch.

### Manual Deployment
To manually deploy the frontend:

```bash
cd frontend
npm run deploy
```

The frontend will be available at: https://heyysid18.github.io/AIMERS

## Backend Deployment

### Option 1: Railway (Recommended)

1. **Sign up for Railway**: Go to [railway.app](https://railway.app) and create an account
2. **Connect your GitHub repository**: 
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your AIMERS repository
3. **Configure the deployment**:
   - Set the root directory to `backend`
   - Add environment variables (see below)
4. **Deploy**: Railway will automatically deploy your backend

### Option 2: Render

1. **Sign up for Render**: Go to [render.com](https://render.com) and create an account
2. **Create a new Web Service**: 
   - Connect your GitHub repository
   - Set the root directory to `backend`
3. **Configure the service**:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables: Add your MongoDB connection string and JWT secret

### Option 3: Heroku

1. **Sign up for Heroku**: Go to [heroku.com](https://heroku.com)
2. **Install Heroku CLI**: Follow the official documentation
3. **Deploy**:
   ```bash
   heroku create your-app-name
   git subtree push --prefix=backend heroku master
   ```

### Option 4: Vercel

1. **Sign up for Vercel**: Go to [vercel.com](https://vercel.com)
2. **Import your repository**: Connect your GitHub repository
3. **Configure**:
   - Set the root directory to `backend`
   - Add environment variables
   - Deploy

## Environment Variables

Make sure to set these environment variables in your deployment platform:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

## GitHub Actions

The project includes GitHub Actions workflows that will:
- ✅ **Frontend**: Automatically deploy to GitHub Pages
- ✅ **Backend**: Test and validate the backend (ready for deployment to your chosen platform)

### Workflow Files:
- `.github/workflows/deploy-frontend.yml` - Frontend deployment to GitHub Pages
- `.github/workflows/deploy-backend.yml` - Backend testing and validation

## Manual Deployment Steps

### Frontend
1. Build the React app: `cd frontend && npm run build`
2. Deploy to GitHub Pages: `npm run deploy`

### Backend
1. Install dependencies: `cd backend && npm install`
2. Set environment variables
3. Start the server: `npm start`

## Quick Start Deployment

### For Railway (Recommended):
1. Go to [railway.app](https://railway.app)
2. Sign up and connect your GitHub account
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your AIMERS repository
5. Set root directory to `backend`
6. Add environment variables
7. Deploy!

### For GitHub Pages (Frontend):
1. Go to your repository settings
2. Navigate to "Pages" section
3. Set source to "GitHub Actions"
4. Your frontend will deploy automatically on push

## Troubleshooting

### Frontend Issues
- Make sure the `homepage` field in `frontend/package.json` matches your GitHub repository
- Check that GitHub Pages is enabled in your repository settings
- Verify the build output in the `frontend/build` directory

### Backend Issues
- Ensure all environment variables are set correctly
- Check that your MongoDB database is accessible
- Verify the server starts locally before deploying
- Make sure the `main` field in `backend/package.json` points to `server.js`

## Support

For deployment issues, check:
1. GitHub Actions logs in your repository
2. Your hosting platform's deployment logs
3. Environment variable configuration
4. Network connectivity to your MongoDB database 