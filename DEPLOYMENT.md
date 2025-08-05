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
2. **Connect your GitHub repository**: Link your AIMERS repository to Railway
3. **Set up environment variables**: Add your MongoDB connection string and JWT secret
4. **Deploy**: Railway will automatically deploy your backend

### Option 2: Render

1. **Sign up for Render**: Go to [render.com](https://render.com) and create an account
2. **Create a new Web Service**: Connect your GitHub repository
3. **Configure the service**:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Environment Variables: Add your MongoDB connection string and JWT secret

### Option 3: Heroku

1. **Sign up for Heroku**: Go to [heroku.com](https://heroku.com)
2. **Install Heroku CLI**: Follow the official documentation
3. **Deploy**:
   ```bash
   heroku create your-app-name
   git push heroku master
   ```

## Environment Variables

Make sure to set these environment variables in your deployment platform:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

## GitHub Actions

The project includes GitHub Actions workflows that will:
- Automatically deploy the frontend to GitHub Pages
- Build and test the backend (ready for deployment to your chosen platform)

## Manual Deployment Steps

### Frontend
1. Build the React app: `cd frontend && npm run build`
2. Deploy to GitHub Pages: `npm run deploy`

### Backend
1. Install dependencies: `cd backend && npm install`
2. Set environment variables
3. Start the server: `npm start`

## Troubleshooting

### Frontend Issues
- Make sure the `homepage` field in `frontend/package.json` matches your GitHub repository
- Check that GitHub Pages is enabled in your repository settings
- Verify the build output in the `frontend/build` directory

### Backend Issues
- Ensure all environment variables are set correctly
- Check that your MongoDB database is accessible
- Verify the server starts locally before deploying

## Support

For deployment issues, check:
1. GitHub Actions logs in your repository
2. Your hosting platform's deployment logs
3. Environment variable configuration 