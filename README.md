# AIMERS - Educational Platform

A comprehensive educational platform for students in classes 9-12, providing access to previous year papers, DPPs (Daily Practice Problems), video lectures, and more.

## 🚀 Features

- **Previous Year Papers**: Access board exam papers from CBSE and other state boards
- **DPPs (Daily Practice Problems)**: Text-based and PDF-based practice problems
- **Video Lectures**: Organized by subject and topic
- **User Authentication**: Secure login/register system
- **Admin Panel**: Upload and manage educational content
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Multer** - File upload handling
- **JWT** - Authentication

## 📁 Project Structure

```
AIMERS/
├── backend/                 # Backend server
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── public/uploads/    # Uploaded files
│   └── server.js          # Main server file
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── api/           # API functions
│   │   └── App.js         # Main app component
│   └── public/            # Static files
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/aimers.git
   cd aimers
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the backend directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

5. **Start the development servers**

   **Backend (Terminal 1):**
   ```bash
   cd backend
   npm start
   ```

   **Frontend (Terminal 2):**
   ```bash
   cd frontend
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Papers
- `GET /api/papers` - Get all papers
- `GET /api/papers/board` - Get board papers
- `GET /api/papers/aimers` - Get AIMERS papers

### DPPs
- `GET /api/dpps` - Get all DPPs
- `GET /api/dpps/:grade/:subject` - Get DPPs by grade and subject
- `POST /api/dpps/submit` - Submit DPP solution

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID

### File Uploads
- `POST /api/upload/:fileType/:className/:subject` - Upload PDF files
- `POST /api/upload/video` - Upload video topics
- `POST /api/upload/dpp` - Upload text DPPs

## 🔧 Configuration

### Backend Configuration
- **Port**: Set via `PORT` environment variable (default: 5000)
- **Database**: MongoDB connection string via `MONGO_URI`
- **JWT Secret**: Set via `JWT_SECRET` environment variable

### Frontend Configuration
- **API Base URL**: Configured in `src/api/api.js`
- **PDF Worker**: Uses local PDF worker file

## 📝 Usage

### For Students
1. Register/Login to your account
2. Browse papers by class and subject
3. Access DPPs for daily practice
4. Watch video lectures
5. Download study materials

### For Admins
1. Login with admin credentials
2. Upload new papers, DPPs, or videos
3. Manage existing content
4. Monitor user activity

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables
2. Install dependencies: `npm install`
3. Start production server: `npm start`

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy the `build` folder to your hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Siddhant jain** - *Initial work* - [YourGitHub]((https://github.com/heyysid18))

## 🙏 Acknowledgments

- AIMERS Coaching Institute for the educational content
- React.js community for the excellent documentation
- MongoDB for the robust database solution

## 📞 Support

For support, email support@aimers.com or create an issue in this repository.

---

**AIMERS** - Empowering students with quality education resources. 
