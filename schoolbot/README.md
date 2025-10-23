# MindMate - AI Learning Platform

A comprehensive AI-powered learning platform for students from Class 1 to Class 12, featuring interactive learning modules, doubt resolution, study planning, and progress tracking.

## 🚀 Features

- **Multi-Class Support**: Interactive learning modules for Class 1-12
- **AI-Powered Doubt Resolution**: Get instant help with questions using Gemini AI
- **Study Planning**: Personalized study plans and schedules
- **Practice Quizzes**: Customizable quizzes for all subjects
- **Progress Tracking**: Detailed analytics and performance insights
- **NEET/JEE Corner**: Specialized preparation modules
- **Voice Recognition**: Ask questions using voice input
- **Emotion Detection**: AI-powered emotion analysis for better learning

## 📁 Project Structure

```
├── index.html                 # Main entry point
├── package.json              # Dependencies and scripts
├── vercel.json              # Vercel deployment configuration
├── css/                     # Stylesheets
│   ├── base.css
│   ├── components.css
│   └── responsive.css
├── javascript/              # JavaScript modules
│   ├── app.js              # Main application logic
│   ├── auth.js             # Authentication
│   ├── config.js           # Firebase configuration
│   ├── doubt.js            # Doubt resolution
│   ├── practice-quiz.js    # Quiz functionality
│   ├── progress.js         # Progress tracking
│   └── study-plan.js       # Study planning
├── classes/                # Class-specific modules
│   ├── class1/            # Class 1 learning games
│   ├── class5/            # Class 5 activities
│   ├── class10/           # Class 10 study tools
│   └── jeeneet/           # NEET/JEE preparation
├── doubt.html             # Doubt resolution page
├── study-plan.html        # Study planning page
├── practice-quiz.html     # Quiz interface
├── progress.html          # Progress tracking page
├── geminiAPI.js          # Gemini AI integration
└── emotionDetection.js   # Emotion detection module
```

## 🛠️ Deployment on Vercel

### Prerequisites

- Vercel account
- Git repository

### Deployment Steps

1. **Push to Git Repository**

   ```bash
   git add .
   git commit -m "Initial deployment setup"
   git push origin main
   ```

2. **Deploy on Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your Git repository
   - Vercel will automatically detect the static site configuration

3. **Environment Variables** (if needed)
   - Add Firebase configuration in Vercel dashboard
   - Add Gemini API key if using external API

### Local Development

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Run Locally**

   ```bash
   vercel dev
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

## 🔧 Configuration

### Firebase Setup

Update `javascript/config.js` with your Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
};
```

### Gemini AI Setup

Update `geminiAPI.js` with your Gemini API key:

```javascript
const GEMINI_API_KEY = "your-gemini-api-key";
```

## 📱 Usage

1. **Main Dashboard**: Access all features from the main dashboard
2. **Class Selection**: Choose your class to access age-appropriate content
3. **Ask Doubts**: Use text, voice, or image input to ask questions
4. **Study Planning**: Create and manage personalized study schedules
5. **Practice Quizzes**: Take quizzes on various subjects and topics
6. **Progress Tracking**: Monitor your learning progress and achievements

## 🎯 Key Features by Class

### Class 1-4

- Interactive games and activities
- Visual learning with animations
- Basic math and language skills
- Parent dashboard for progress tracking

### Class 5-8

- Gamified learning modules
- Subject-specific activities
- Achievement system
- Progress tracking

### Class 9-12

- Advanced study tools
- NEET/JEE preparation
- Comprehensive doubt resolution
- Detailed analytics

## 🔒 Security

- Firebase Authentication for user management
- Secure API key handling
- Input validation and sanitization
- HTTPS enforcement

## 📊 Performance

- Optimized for Vercel's CDN
- Lazy loading for better performance
- Responsive design for all devices
- Fast loading times

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Ready for Vercel Deployment! 🚀**
