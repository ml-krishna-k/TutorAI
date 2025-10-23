# Emotion Detection System - SchoolBot

## Overview

The Emotion Detection System uses Gemini AI to analyze student responses and detect emotional states. It asks 2 questions to students based on their class level and analyzes their answers to determine if they are **HAPPY**, **SAD**, or **DEPRESSED**.

## Features

### 🧠 Emotional Wellness Check
- **Age-appropriate questions** for each class level (Class 1-12)
- **Gemini AI-powered analysis** of student responses
- **Real-time emotion detection** with visual feedback
- **Supportive messages** based on detected emotions

### 📊 Emotion Categories
- **😊 HAPPY**: Positive emotions, enthusiasm, contentment
- **😔 SAD**: Mild negative emotions, disappointment, worry  
- **😢 DEPRESSED**: Serious negative emotions, hopelessness, severe distress

## Integration Points

### 1. Class-Based Learning Systems
- **Class 1**: Wonder Valley Learning Adventure
- **Class 5**: Gamified Learning System
- **Class 10**: StudyBuddy Platform
- **JEE/NEET**: Exam Prep Pro Platform

### 2. Frontend Systems
- **Main Dashboard**: NEET & JEE Corner
- **Doubt System**: Ask a Doubt feature

## How It Works

### 1. Question Flow
```
Student enters class → Emotion detection starts → 2 questions asked → Gemini analyzes → Result shown → Continue learning
```

### 2. Class-Specific Questions

**Class 1-3**: Simple, child-friendly questions
- "How do you feel about your studies today?"
- "What made you happy or sad today?"

**Class 4-6**: More detailed questions
- "How confident do you feel about your studies?"
- "What challenges or successes did you face today?"

**Class 7-9**: Academic focus
- "How do you feel about your learning journey?"
- "What emotions do you experience with your studies?"

**Class 10-12**: Future-oriented questions
- "How do you feel about your board exam preparation?"
- "What's your emotional state regarding your academic goals?"

### 3. AI Analysis Process
1. **Question Collection**: Student answers 2 questions
2. **Gemini Analysis**: AI analyzes response patterns
3. **Emotion Classification**: Categorizes as HAPPY/SAD/DEPRESSED
4. **Result Display**: Shows emotion with supportive message
5. **Continue Learning**: Returns to previous page

## Technical Implementation

### Files Created/Modified

#### New Files:
- `frontend/emotionDetection.js` - Main emotion detection module
- `EMOTION_DETECTION_README.md` - This documentation

#### Modified Files:
- `frontend/index.html` - Added emotion detection scripts
- `frontend/javascript/app.js` - Integrated emotion detection
- `class5/index.html` - Added emotion detection scripts
- `class5/app.js` - Integrated emotion detection
- `class10/index.html` - Added emotion detection scripts  
- `class10/app.js` - Integrated emotion detection
- `class 1/index.html` - Added emotion detection scripts
- `class 1/script.js` - Integrated emotion detection
- `JEENEET/index.html` - Added emotion detection scripts
- `JEENEET/app.js` - Integrated emotion detection
- `frontend/doubt.html` - Added emotion detection scripts
- `frontend/javascript/doubt.js` - Integrated emotion detection

### Key Components

#### EmotionDetection Class
```javascript
class EmotionDetection {
    constructor() {
        this.questions = { /* class-specific questions */ };
        this.currentQuestionIndex = 0;
        this.studentAnswers = [];
    }
    
    startEmotionDetection(studentClass) { /* main entry point */ }
    createEmotionModal() { /* creates UI modal */ }
    analyzeEmotions() { /* calls Gemini API */ }
    showEmotionResult() { /* displays results */ }
}
```

#### Gemini AI Integration
```javascript
async callGeminiAPI(prompt) {
    const response = await window.geminiAPI.generateTextResponse(prompt, {
        temperature: 0.3,
        maxTokens: 100
    });
    return response;
}
```

## Usage

### For Students
1. Navigate to any class section or doubt system
2. Emotion detection modal appears automatically
3. Answer 2 questions about your feelings
4. View your emotional analysis result
5. Continue with your learning journey

### For Developers
```javascript
// Start emotion detection for any class
window.emotionDetection.startEmotionDetection(classNumber);

// Example: Start for Class 5
window.emotionDetection.startEmotionDetection(5);
```

## Benefits

### 🎯 Student Benefits
- **Emotional awareness** and self-reflection
- **Early detection** of academic stress
- **Supportive guidance** based on emotional state
- **Non-intrusive** integration with learning

### 📚 Educational Benefits
- **Mental health monitoring** for students
- **Personalized support** based on emotional needs
- **Data-driven insights** for educators
- **Proactive intervention** opportunities

## Safety & Privacy

### 🔒 Privacy Protection
- **No permanent storage** of emotional data
- **Session-only analysis** (not saved)
- **Anonymous processing** through Gemini API
- **Optional participation** (can skip questions)

### 🛡️ Safety Features
- **Age-appropriate questions** for each class
- **Supportive messaging** for negative emotions
- **Fallback analysis** if AI is unavailable
- **Error handling** for API failures

## Future Enhancements

### Planned Features
- **Emotional trend tracking** over time
- **Parent/teacher notifications** for concerning patterns
- **Personalized coping strategies** based on emotions
- **Integration with school counseling** services

### Technical Improvements
- **Offline emotion analysis** capabilities
- **Multi-language support** for questions
- **Voice-based emotion detection**
- **Real-time emotional monitoring**

## Support

For technical support or questions about the emotion detection system, please refer to the main project documentation or contact the development team.

---

**Note**: This system is designed to support student well-being and should not replace professional mental health services. Students experiencing persistent negative emotions should be encouraged to speak with trusted adults or mental health professionals. 