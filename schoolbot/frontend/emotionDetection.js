// Emotion Detection Module using Gemini AI
class EmotionDetection {
    constructor() {
        this.questions = {
            class1: [
                "How do you feel about your studies today?",
                "What made you happy or sad today?"
            ],
            class2: [
                "How are you feeling about your school work?",
                "What's the best and worst thing that happened today?"
            ],
            class3: [
                "How do you feel about your learning progress?",
                "What emotions did you experience while studying today?"
            ],
            class4: [
                "How confident do you feel about your studies?",
                "What challenges or successes did you face today?"
            ],
            class5: [
                "How do you feel about your academic performance?",
                "What emotions arise when you think about your studies?"
            ],
            class6: [
                "How do you feel about your current academic situation?",
                "What's your emotional state regarding school work?"
            ],
            class7: [
                "How do you feel about your learning journey?",
                "What emotions do you experience with your studies?"
            ],
            class8: [
                "How do you feel about your academic progress?",
                "What's your emotional well-being regarding education?"
            ],
            class9: [
                "How do you feel about your academic performance?",
                "What emotions arise when you think about your future?"
            ],
            class10: [
                "How do you feel about your board exam preparation?",
                "What's your emotional state regarding your academic goals?"
            ],
            class11: [
                "How do you feel about your competitive exam preparation?",
                "What emotions do you experience with your studies?"
            ],
            class12: [
                "How do you feel about your final year and career preparation?",
                "What's your emotional well-being regarding your future?"
            ]
        };
        
        this.currentQuestionIndex = 0;
        this.studentAnswers = [];
        this.currentClass = null;
    }

    // Initialize emotion detection for a specific class
    initEmotionDetection(studentClass) {
        this.currentClass = studentClass;
        this.currentQuestionIndex = 0;
        this.studentAnswers = [];
        
        // Create emotion detection modal
        this.createEmotionModal();
        
        // Show first question
        this.showQuestion();
    }

    // Create the emotion detection modal
    createEmotionModal() {
        // Remove existing modal if any
        const existingModal = document.getElementById('emotionModal');
        if (existingModal) {
            existingModal.remove();
        }

        const modalHTML = `
            <div id="emotionModal" class="emotion-modal">
                <div class="emotion-modal-content">
                    <div class="emotion-header">
                        <h2>🧠 Emotional Wellness Check</h2>
                        <p>Let's understand how you're feeling today!</p>
                    </div>
                    
                    <div class="question-container">
                        <div class="question-counter">
                            Question <span id="questionNumber">1</span> of 2
                        </div>
                        <div class="question-text" id="questionText">
                            <!-- Question will be inserted here -->
                        </div>
                        
                        <div class="answer-input">
                            <textarea 
                                id="emotionAnswer" 
                                placeholder="Please share your thoughts..."
                                rows="4"
                                class="emotion-textarea"
                            ></textarea>
                        </div>
                        
                        <div class="emotion-buttons">
                            <button id="nextEmotionBtn" class="emotion-btn primary">
                                Next Question
                            </button>
                            <button id="skipEmotionBtn" class="emotion-btn secondary">
                                Skip
                            </button>
                        </div>
                    </div>
                    
                    <div class="result-container hidden" id="emotionResult">
                        <div class="result-header">
                            <h3>🎯 Emotional Analysis Complete!</h3>
                        </div>
                        <div class="emotion-display" id="emotionDisplay">
                            <!-- Emotion result will be shown here -->
                        </div>
                        <div class="result-actions">
                            <button id="continueBtn" class="emotion-btn primary">
                                Continue Learning
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.bindModalEvents();
    }

    // Bind events for the emotion modal
    bindModalEvents() {
        const nextBtn = document.getElementById('nextEmotionBtn');
        const skipBtn = document.getElementById('skipEmotionBtn');
        const continueBtn = document.getElementById('continueBtn');

        nextBtn.addEventListener('click', () => this.handleNextQuestion());
        skipBtn.addEventListener('click', () => this.handleSkip());
        continueBtn.addEventListener('click', () => this.handleContinue());
    }

    // Show current question
    showQuestion() {
        const questionNumber = document.getElementById('questionNumber');
        const questionText = document.getElementById('questionText');
        const answerInput = document.getElementById('emotionAnswer');
        const nextBtn = document.getElementById('nextEmotionBtn');

        questionNumber.textContent = this.currentQuestionIndex + 1;
        
        const classKey = `class${this.currentClass}`;
        const questions = this.questions[classKey] || this.questions.class5; // fallback to class5
        
        questionText.textContent = questions[this.currentQuestionIndex];
        answerInput.value = '';
        answerInput.focus();

        // Update button text
        if (this.currentQuestionIndex === 1) {
            nextBtn.textContent = 'Analyze Emotions';
        } else {
            nextBtn.textContent = 'Next Question';
        }
    }

    // Handle next question or analysis
    async handleNextQuestion() {
        const answerInput = document.getElementById('emotionAnswer');
        const answer = answerInput.value.trim();

        if (!answer) {
            alert('Please provide an answer before continuing.');
            return;
        }

        this.studentAnswers.push(answer);

        if (this.currentQuestionIndex < 1) {
            // Move to next question
            this.currentQuestionIndex++;
            this.showQuestion();
        } else {
            // Analyze emotions
            await this.analyzeEmotions();
        }
    }

    // Handle skip
    handleSkip() {
        this.studentAnswers.push('Skipped');
        
        if (this.currentQuestionIndex < 1) {
            this.currentQuestionIndex++;
            this.showQuestion();
        } else {
            this.analyzeEmotions();
        }
    }

    // Analyze emotions using Gemini AI
    async analyzeEmotions() {
        try {
            // Show loading state
            const nextBtn = document.getElementById('nextEmotionBtn');
            nextBtn.textContent = 'Analyzing...';
            nextBtn.disabled = true;

            // Prepare the analysis prompt
            const analysisPrompt = this.createAnalysisPrompt();
            
            // Use Gemini API to analyze emotions
            const emotionResult = await this.callGeminiAPI(analysisPrompt);
            
            // Display the result
            this.showEmotionResult(emotionResult);
            
        } catch (error) {
            console.error('Error analyzing emotions:', error);
            this.showEmotionResult('Unable to analyze emotions at this time. Please try again later.');
        }
    }

    // Create analysis prompt for Gemini
    createAnalysisPrompt() {
        const classKey = `class${this.currentClass}`;
        const questions = this.questions[classKey] || this.questions.class5;
        
        return `Analyze the emotional state of a student based on their answers to these questions:

Question 1: ${questions[0]}
Answer 1: ${this.studentAnswers[0]}

Question 2: ${questions[1]}
Answer 2: ${this.studentAnswers[1]}

Please analyze the student's emotional state and respond with ONLY one of these three emotions:
- HAPPY: if the student shows positive emotions, enthusiasm, or contentment
- SAD: if the student shows mild negative emotions, disappointment, or worry
- DEPRESSED: if the student shows serious negative emotions, hopelessness, or severe distress

Respond with only the emotion word (HAPPY, SAD, or DEPRESSED) and a brief explanation of why you chose that emotion. Keep the explanation under 50 words.`;
    }

    // Call Gemini API
    async callGeminiAPI(prompt) {
        try {
            // Check if Gemini API is available
            if (typeof window.geminiAPI === 'undefined' || !window.geminiAPI) {
                throw new Error('Gemini API not available');
            }

            const response = await window.geminiAPI.generateTextResponse(prompt, {
                temperature: 0.3,
                maxTokens: 100
            });

            return response;
        } catch (error) {
            console.error('Gemini API error:', error);
            // Fallback analysis
            return this.fallbackEmotionAnalysis();
        }
    }

    // Fallback emotion analysis
    fallbackEmotionAnalysis() {
        const answers = this.studentAnswers.join(' ').toLowerCase();
        
        // Simple keyword-based analysis
        const happyKeywords = ['happy', 'good', 'great', 'excellent', 'wonderful', 'excited', 'love', 'enjoy'];
        const sadKeywords = ['sad', 'bad', 'worried', 'concerned', 'difficult', 'hard', 'struggle'];
        const depressedKeywords = ['depressed', 'hopeless', 'terrible', 'awful', 'hate', 'can\'t', 'impossible'];
        
        let happyCount = 0, sadCount = 0, depressedCount = 0;
        
        happyKeywords.forEach(keyword => {
            if (answers.includes(keyword)) happyCount++;
        });
        
        sadKeywords.forEach(keyword => {
            if (answers.includes(keyword)) sadCount++;
        });
        
        depressedKeywords.forEach(keyword => {
            if (answers.includes(keyword)) depressedCount++;
        });
        
        if (depressedCount > 0) return 'DEPRESSED: Multiple negative indicators detected in responses.';
        if (sadCount > 0) return 'SAD: Some negative emotions detected in responses.';
        if (happyCount > 0) return 'HAPPY: Positive emotions detected in responses.';
        
        return 'HAPPY: No significant negative emotions detected.';
    }

    // Show emotion result
    showEmotionResult(result) {
        const questionContainer = document.querySelector('.question-container');
        const resultContainer = document.getElementById('emotionResult');
        const emotionDisplay = document.getElementById('emotionDisplay');

        // Hide question container
        questionContainer.classList.add('hidden');
        
        // Parse the result
        const emotion = this.parseEmotionResult(result);
        
        // Create emotion display
        const emotionHTML = this.createEmotionDisplay(emotion);
        emotionDisplay.innerHTML = emotionHTML;
        
        // Show result container
        resultContainer.classList.remove('hidden');
    }

    // Parse emotion result from Gemini response
    parseEmotionResult(result) {
        const resultLower = result.toLowerCase();
        
        if (resultLower.includes('happy')) {
            return {
                emotion: 'HAPPY',
                icon: '😊',
                color: '#4CAF50',
                message: 'Great! You seem to be in a positive state of mind. Keep up the good work!'
            };
        } else if (resultLower.includes('sad')) {
            return {
                emotion: 'SAD',
                icon: '😔',
                color: '#FF9800',
                message: 'It\'s okay to feel this way. Remember, every challenge is an opportunity to grow stronger.'
            };
        } else if (resultLower.includes('depressed')) {
            return {
                emotion: 'DEPRESSED',
                icon: '😢',
                color: '#F44336',
                message: 'Your feelings are valid. Please consider talking to a trusted adult or counselor for support.'
            };
        } else {
            return {
                emotion: 'NEUTRAL',
                icon: '😐',
                color: '#9E9E9E',
                message: 'Your emotional state appears neutral. How can we help you feel more positive about your studies?'
            };
        }
    }

    // Create emotion display HTML
    createEmotionDisplay(emotion) {
        return `
            <div class="emotion-result" style="color: ${emotion.color};">
                <div class="emotion-icon">${emotion.icon}</div>
                <div class="emotion-label">${emotion.emotion}</div>
                <div class="emotion-message">${emotion.message}</div>
            </div>
        `;
    }

    // Handle continue button
    handleContinue() {
        // Close the modal
        const modal = document.getElementById('emotionModal');
        if (modal) {
            modal.remove();
        }
        
        // Return to previous page or continue with normal flow
        // This will be handled by the calling class
    }

    // Public method to start emotion detection
    startEmotionDetection(studentClass) {
        this.initEmotionDetection(studentClass);
    }
}

// Add CSS styles for emotion detection modal
const emotionStyles = `
<style>
.emotion-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    font-family: 'Poppins', sans-serif;
}

.emotion-modal-content {
    background: white;
    border-radius: 20px;
    padding: 30px;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.emotion-header {
    text-align: center;
    margin-bottom: 30px;
}

.emotion-header h2 {
    color: #333;
    margin-bottom: 10px;
    font-size: 24px;
}

.emotion-header p {
    color: #666;
    font-size: 16px;
}

.question-container {
    margin-bottom: 20px;
}

.question-counter {
    text-align: center;
    color: #666;
    font-size: 14px;
    margin-bottom: 20px;
}

.question-text {
    font-size: 18px;
    color: #333;
    margin-bottom: 20px;
    line-height: 1.5;
    text-align: center;
}

.emotion-textarea {
    width: 100%;
    padding: 15px;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-size: 16px;
    font-family: inherit;
    resize: vertical;
    min-height: 100px;
    transition: border-color 0.3s;
}

.emotion-textarea:focus {
    outline: none;
    border-color: #4CAF50;
}

.emotion-buttons {
    display: flex;
    gap: 15px;
    justify-content: center;
    margin-top: 20px;
}

.emotion-btn {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
}

.emotion-btn.primary {
    background-color: #4CAF50;
    color: white;
}

.emotion-btn.primary:hover {
    background-color: #45a049;
}

.emotion-btn.secondary {
    background-color: #f0f0f0;
    color: #333;
}

.emotion-btn.secondary:hover {
    background-color: #e0e0e0;
}

.emotion-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.result-container {
    text-align: center;
}

.result-header h3 {
    color: #333;
    margin-bottom: 20px;
    font-size: 20px;
}

.emotion-result {
    margin: 20px 0;
}

.emotion-icon {
    font-size: 48px;
    margin-bottom: 10px;
}

.emotion-label {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 10px;
}

.emotion-message {
    font-size: 16px;
    line-height: 1.5;
    color: #666;
}

.result-actions {
    margin-top: 30px;
}

.hidden {
    display: none !important;
}

@media (max-width: 600px) {
    .emotion-modal-content {
        padding: 20px;
        margin: 20px;
    }
    
    .emotion-buttons {
        flex-direction: column;
    }
    
    .emotion-btn {
        width: 100%;
    }
}
</style>
`;

// Inject styles into document
if (!document.getElementById('emotion-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'emotion-styles';
    styleElement.innerHTML = emotionStyles;
    document.head.appendChild(styleElement);
}

// Initialize emotion detection
window.emotionDetection = new EmotionDetection(); 